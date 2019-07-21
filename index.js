const express = require('express');
var router = express.Router();
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 5000;
var pg = require('pg');
const { Pool } = require('pg');
const connectionString= process.env.DATABASE_URL || "postgres://xudkuimqplpmmo:0516a5ff94de949e55869277eeb1d5c820cde815c54e3c0f8c331b103f52ccee@ec2-54-243-47-196.compute-1.amazonaws.com:5432/d40chnldedvpjo?ssl=true";

const pool = new Pool({connectionString: connectionString});


let sessions=new Map();// session -> user_id
function GUID(){
	return 'X-'+('00000000'+(Math.random()*0x100000000>>>0).toString(16)).slice(-8)+
			'-'+('00000000'+(Math.random()*0x100000000>>>0).toString(16)).slice(-8)+
			'-'+('00000000'+(Math.random()*0x100000000>>>0).toString(16)).slice(-8)+
			'-'+('00000000'+(Math.random()*0x100000000>>>0).toString(16)).slice(-8);
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// tell it to use the public directory as one where static files live
app.use(express.static(path.join(__dirname, 'public')))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'ejs')
	.get('/', (req, res) => {
		const params = {error: undefined};
		res.render('signin', params);
	})
	.post('/login', getLogin)
	.post('/create_account', getsignup)
	.get('/signup', (req, res) => {
		const params = {error: undefined};
		res.render('signup', params);
	})
	.get('/logout', function(req, res){
		cookie = req.cookies;
		for (var prop in cookie) {
			if (!cookie.hasOwnProperty(prop)) {
				continue;
			}    
			res.cookie(prop, '', {expires: new Date(0)});
		}
		res.redirect('/');
	})
	.listen(port, function() {
		console.log('Node app is running on port', port);
      
   
	});

function getLogin(req, res) {
	let username = req.body.username;
	let password = req.body.password;
	
      pool.connect();
      pool.query("SELECT * FROM users where username =$1",[username], function (err, result){
         if (result.rows.length == 0 || result.rows[0].password != password){
          const params = {error: "Invalid username or password"};
          res.render('signin', params);
             return; 
         }
         setSession(req, res, 1/*user_id*/);
         res.redirect('home.html');
      });	
}

function getsignup(req, res) {
	let username = req.body.username;
	let password = req.body.password;  
   let valid = true;
   
      pool.connect();
       pool.query("SELECT * FROM users where username =$1",[username], function (err, result){
        if (result.rows.length > 0){
          const params = {error: "Username already in use"};
          res.render('signup', params);
          valid = false;
          return;
        }
        if(valid){
     pool.query("INSERT INTO users(username,password) VALUES($1,$2)",[username, password], function (err, result){
     	const params = {error: undefined, username: username};
      res.render('signin', params);
       });
        }
       });
}

function setSession(req, res, userID){
	let sessionID=GUID();
	sessions.set(sessionID, userID);
	res.cookie('session',sessionID);
}

function getAuthenticatedUserID(req, res){
	validateSession(req, res);
	return sessions.get(req.cookies.session);
}

function validateSession(req, res){
	let session = req.cookies.session;// Get cookie
	
	if (!sessions.has(session)){
		res.redirect('noauth.html');
		res.end();
		throw new Error("Not logged in.");
	}
}