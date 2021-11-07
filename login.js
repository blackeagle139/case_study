/*
	Nguyen Si Thao, case study
*/
//=====================================================================================

//----- call all required modules
//var mysql = require('mysql'); // no need connection to database for this case
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
//var config = require('config'); // hardcode when generate token 

//----- use express for web server
var app = express();


//----- store session details
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


//----- body parser extract form data from html file
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//-----------------------------------------------------------------------
/*

	Challenge 1, Part 1, /token

 */
//----- expose end point token 
app.get('/token', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

//----- handle post command after click submit button
app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	
	if (username && password) 
	{	
		if (username == password) // authentication method: if same username as password, consider correct, else wrong
		{
			request.session.loggedin = true; //=> session variables, determine client is logged in
			request.session.username = username; // => session variables, username after logged in
			
			//----- create jwt token for authorized user
			// create a JWT token
			// secret key put here for example only
			var token = jwt.sign( {username}, 'structo', {
			  expiresIn: 120 // expires in 2 mins for test
			});
			
			var jsonResponse = {token : { accessToken : "structo"}}
			response.status(200).send(jsonResponse);			
		} 
		else 
		{
			response.send('Incorrect Username and/or Password!');
		}			
		response.end();
	} 
	else 
	{
		response.send('Please enter Username and Password!');
		response.end();
	}
});
//-----------------------------------------------------------------------
/*

	Challenge 1, Part 1, /about
 */

const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];

    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;
        next();
    } else {
        //If header is undefined return Forbidden (403)
        res.sendStatus(403)
    }
}


 app.get('/about', checkToken, (req, res) => {
	 
	
	 if (req.token == "structo"){
		 res.send('Hello World');
	 }else{
		 	 res.sendStatus(401);
	 }
	 
	 

	 

    });
//-----------------------------------------------------------------------
/*

	Challenge 1, Part 2, allow client to regenerate a new token

 */
 
 
 
//----- web server listen on a port
app.listen(3000);