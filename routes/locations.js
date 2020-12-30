const router = require('express').Router();
const connection = require('../config/database');
const { post } = require('./usr');

router.post('/pickuppoints', (req, res) => {
	sql = `select l.id, l.Location from PickupLocations l left join CityDetails c on l.cityid = c.id where city = '${req.body.city}'`;
	connection.query(sql, (err, data) => {
		if (err) throw err;
		res.send(data);
	});
});
router.post('/city/list', (req, res) => {
    const sql = 'select * from CityDetails'
    connection.query(sql, (err, data) => {
        if (err) throw err;
        res.send(data);
    })
});



module.exports = router;