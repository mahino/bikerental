var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
const Joi = require('joi');
const connection = require("./config/database");
const usrRoute = require("./routes/usr");
const groupRoute = require("./routes/group");
const locRoute = require('./routes/locations');
const bikeRoute = require('./routes/bikes');
const dotenv = require("dotenv");

const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

dotenv.config();

app.use('/api/usr', usrRoute);
app.use('/api/group', groupRoute);
app.use('/api/loc', locRoute);
app.use('/api/bikes', bikeRoute);


app.post('/api/availablebikes', (req, res) => {
	var city = req.body.city;
	if ('byLocation' in req.body) {
		var byLocation = req.body.byLocation;
	}
	else {
		var byLocation = false;
	};
	if ('byBike' in req.body) {
		var byBike = req.body.byBike;
	}
	else {
		var byBike = false;
	};
	sql = `select * from AvailableBikes where bike in (select bike from BikesInCities where ${city} = 1);`;
	connection.query(sql, (err, data) => {
		if (err) throw err;
		var bikedata = {};
		for (i in data) {
			bikedata[data[i]["bike"]] = data[i]["status"];
		};
		console.log(bikedata);
		var locationsdata = [];
		sql = `select id, PickupLocations from PickupLocations where city = '${city}'`;
		connection.query(sql, (err, data) => {
			if (err) throw err;
			for (i in data) {
				s= {}
				s["id"] = data[i].id
				s["location"] = data[i].PickupLocations
				locationsdata.push(s);
			};
			console.log(locationsdata)
			if (byLocation && byBike) {
				res.status(400).send("By Both isn't Possible")
			}
			else if (byBike) {
				respon = {};
				for (i in locationsdata) {
					respon[locationsdata[i]["location"]] = bikedata[req.body.bike].toString()[locationsdata[i]["id"] - 1]
				};
				res.send(respon)
			}
			else if (byLocation) {
				for (i in locationsdata){
					if (locationsdata[i]["location"] == req.body.location) {
						locationid = locationsdata[i]["id"]
						break;
					};
				};
				var respon = {};
				for (i in bikedata) {
					respon[i] = bikedata[i].toString()[locationid - 1]
				};
				res.send(respon);
			};
		});
	});	
});

app.listen(process.env.DB_PORT);