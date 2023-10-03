const express = require('express');
const population = require('../../controllers/population');
const router = express.Router();

router.put('/state/:state/city/:city', async (req, res) => {
    await population.updatePopulation(req, res);
});
router.get('/state/:state/city/:city', async (req, res) => {
    const { state, city } = req.params;
    await population.getPopulation(state.toLowerCase(), city.toLowerCase(), res);
});

module.exports = router;
