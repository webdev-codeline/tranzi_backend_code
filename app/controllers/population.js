const { pgPool } = require('../db/postgres');
const { initializeRedis } = require('../db/redis');

let redisClient;

(async () => {
    redisClient = await initializeRedis();

})();
const getPopulation = async (state, city, res) => {

    const cacheKey = `${state}:${city}`;
    const result = await redisClient.get(cacheKey);
    if (result) {
        return res.status(200).json({ population: parseInt(result) });
    }
    try {
        const queryResult = await pgPool.query('SELECT population FROM populations WHERE state = $1 AND city = $2', [state.toLowerCase(), city.toLowerCase()]);
        if (queryResult.rows.length === 0) {
            return res.status(400).send('The given state/city combination could not be found');
        }
        const population = queryResult.rows[0].population;
        await redisClient.set(cacheKey, population, {
            EX: 3600,
            NX: true,

        });  // Cache the result for 1 hour
        return res.status(200).json({ population });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }

}
const updatePopulation = async (req, res) => {
    let { state, city } = req.params;
    const population = parseInt(req.body, 10);
    console.log(req.body);
    if (isNaN(population)) {
        return res.status(400).send('Invalid population data');
    }

    state = state.toLowerCase();
    city = city.toLowerCase();

    try {
        const { rowCount } = await pgPool.query('UPDATE populations SET population = $3 WHERE state = $1 AND city = $2', [state, city, population]);

        if (rowCount === 0) {
            await pgPool.query('INSERT INTO populations (state, city, population) VALUES ($1, $2, $3)', [state, city, population]);
            return res.status(201).json({ message: 'Population added' });
        } else {
            const cacheKey = `${state}:${city}`;
            await redisClient.set(cacheKey, population, {
                EX: 3600
            });
            return res.status(200).json({ message: 'Population updated' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
}

module.exports = {
    getPopulation,
    updatePopulation
}