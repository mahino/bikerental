const router = require('express').Router();
const connection = require('../config/database');
const veriy = require('../verifyToken');

router.get('/',veriy, (req,res, next) => {
    sql = `select * from groupsdata where groupname = '${req.body.group}';`
	connection.query(sql, (err, data) => {
		if (err) throw err;
		res.send(data);
	});
});
router.post('/usr/list', (req, res) => {
	group = req.body.group
	sql = `select g.groupname, a.username, a.email from accounts a right join groupsdata g on a.groupid = g.gid where groupname = '${group}';`
	connection.query(sql, (err, data) => {
		if (err) throw err;
		res.send(data);
    });
});

module.exports = router;