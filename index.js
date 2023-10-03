require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');
const app = express();
const port = 5555;

const pool = new Pool({
    user: process.env.DB_USER || 'user',
    host: process.env.DB_HOST || 'db',
    database: process.env.DB_NAME || 'citypopulations',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

app.use(express.text());


let redisClient;

(async () => {
    redisClient = redis.createClient({
        socket: {
            host: 'redis',
        },
        database: 0
    })
       redisClient.on('error', err => console.log('Redis Client Error', err))
      await  redisClient.connect();

})();


const getPopulationFromDb = async (state, city, res) => {
    console.log('AAA');
    const cacheKey = `${state}:${city}`;
    // Check cache first
    const result = await redisClient.get(cacheKey);
    if (result) {
        return res.status(200).json({ population: parseInt(result) });
    }
    try {
        const queryResult = await pool.query('SELECT population FROM populations WHERE state = $1 AND city = $2', [state.toLowerCase(), city.toLowerCase()]);
        console.log(queryResult);

        if (queryResult.rows.length === 0) {
            return res.status(400).send('The given state/city combination could not be found');
        }
        const population = queryResult.rows[0].population;
        await redisClient.set(cacheKey,population, {
                EX: 3600,
                NX: true,
              
        });  // Cache the result for 1 hour
        return res.status(200).json({ population });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
    // return redisClient.get(cacheKey, async (err, data) => {
    //     console.log(data);
    //     if (data) {
    //         return res.status(200).json({ population: parseInt(data) });
    //     }

    //     // If not in cache, query the database
    //     try {
    //         const queryResult = await pool.query('SELECT population FROM populations WHERE state = $1 AND city = $2', [state.toLowerCase(), city.toLowerCase()]);
    //         console.log(queryResult);

    //         if (queryResult.rows.length === 0) {
    //             return res.status(400).send('The given state/city combination could not be found');
    //         }
    //         const population = queryResult.rows[0].population;
    //         redisClient.setex(cacheKey, 3600, population);  // Cache the result for 1 hour
    //         return res.status(200).json({ population });
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).send('Internal server error');
    //     }
    // });
};

app.get('/api/population/state/:state/city/:city', async (req, res) => {
    const { state, city } = req.params;
    await getPopulationFromDb(state.toLowerCase(), city.toLowerCase(), res);
});

app.put('/api/population/state/:state/city/:city', async (req, res) => {
    let { state, city } = req.params;
    const population = parseInt(req.body, 10);

    if (isNaN(population)) {
        return res.status(400).send('Invalid population data');
    }

    state = state.toLowerCase();
    city = city.toLowerCase();

    try {
        const { rowCount } = await pool.query('UPDATE populations SET population = $3 WHERE state = $1 AND city = $2', [state, city, population]);

        if (rowCount === 0) {
            await pool.query('INSERT INTO populations (state, city, population) VALUES ($1, $2, $3)', [state, city, population]);
            return res.status(201).json({ message: 'Population added' });
        } else {
            return res.status(200).json({ message: 'Population updated' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});
