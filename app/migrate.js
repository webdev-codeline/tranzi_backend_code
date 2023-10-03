require('dotenv').config();
const fs = require('fs');
const csvParser = require('csv-parser');
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'citypopulations',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5433,
});

const migrateData = async () => {
    const results = [];

    fs.createReadStream('../data/city_populations.csv')
        .pipe(csvParser({
            headers: false, // Specify that there are no headers
        }))
        .on('data', async (row) => {
            results.push({ city: row[0], state: row[1], population: row[2] });
            // console.log(row);

        })
        .on('end', async () => {
            console.log(results);
            for (const row of results) {

                try {
                    await pool.query('INSERT INTO populations (state, city, population) VALUES ($1, $2, $3)',
                        [row.state.toLowerCase(), row.city.toLowerCase(), parseInt(row.population)]);
                } catch (err) {
                    console.error(err);
                }

            }
            console.log('Migration completed.');
            process.exit();
        });
};

migrateData();
