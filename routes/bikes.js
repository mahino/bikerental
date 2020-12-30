const router = require('express').Router();
const connection = require('../config/database');

router.get('/pricedetails', (req, res) => {
    sql = `select * from BikeDetails b join pricedetails p on b.priceid = p.id where bikename= '${req.body.bike}'`;
	connection.query(sql, (err, data) => {
		if (err) throw err;
		else if (!data.length) return res.status(400).send("Bike details not found");
		res.send(data[0]);
	});
})




module.exports = router;