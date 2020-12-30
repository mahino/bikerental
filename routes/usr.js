const router = require('express').Router();
const connection = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validations');

router.post('/register', async (req, res) => {
    const result = registerValidation(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    connection.query(`select * from accounts where username = '${req.body.username}'`, async (err, data)  => {
	    if (err) throw err;
	    userExist = data.length;
        if (userExist) return res.status(200).send("User already exists.");
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashPassword;
	   	sql = "INSERT INTO accounts (username, password, email, groupid) VALUES (?, ?, ?, ?);";
	    connection.query(sql, [req.body.username, req.body.password, req.body.email, req.body.groupid], (err, data)  => {
		    if (err) throw err;
    		res.send(data);
	   	});
    });
});
router.post('/login', (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    connection.query(`select * from accounts where username = '${req.body.username}'`, async (err, data)  => {
        if (err) throw err;
        console.log(data[0].password);
        const userExist = data.length;
        const validPass = await bcrypt.compare(req.body.password, data[0].password);
        if (!userExist) return res.status(200).send("User doesn't exists.");
        else if (!validPass) return res.status(400).send("Invalid password");

        const token = jwt.sign({_id:data[0].id}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token)
    });
});
router.post('/list', (req, res) => {
    connection.query("SELECT * FROM accounts", function (error, result, fields) {
		if (error) throw error;
		res.send(result)
	});
})
router.get('/:id', (req, res) => {
    id=req.params.id;
	connection.query(`select a.id, a.username, a.email, g.groupname from accounts a left join groupsdata g on g.gid = a.groupid where id = ${id}`, function (error, result, fields) {
		if (error) return res.status(400).send("Bad request")
		else if (result.length) return res.send(result[0]);
		else res.status(404).send("user not found");
	});
})
router.get('/:id/discount', (req, res) => {
	id = req.params.id
	sql = `select username, discount from accounts a inner join groupsdata g on a.groupid = g.gid where a.id = ${id}`
	connection.query(sql, (err, data) => {
        if (err) throw err;
        data[0].discount = data[0].discount.toString().concat('', '%')
		res.send(data[0])
	});
});


module.exports = router;