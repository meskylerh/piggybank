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
pool.connect();
let sessions=new Map();// session -> user_id
function GUID(){
	return 'X-'+('00000000'+(Math.random()*0x100000000>>>0).toString(16)).slice(-8)+
			'-'+('00000000'+(Math.random()*0x100000000>>>0).toString(16)).slice(-8)+
			'-'+('00000000'+(Math.random()*0x100000000>>>0).toString(16)).slice(-8)+
			'-'+('00000000'+(Math.random()*0x100000000>>>0).toString(16)).slice(-8);
}
const form_type ={
   unsecured: 1,
   secured: 2,
   partial: 3
};
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'ejs')

	/* DEFAULT LANDING PAGE */
	.get('/', (req, res) => {
		const params = {error: undefined};
		res.render('signin', params);
	})
	
	/* LOGIN */
	.post('/login', (req, res) => {
		let username = req.body.username;
		let password = req.body.password;

		pool.query("SELECT * FROM users where username =$1",[username], function (err, result){
			if (result.rows.length == 0 || result.rows[0].password != password){
				const params = {error: "Invalid username or password"};
				res.render('signin', params);
				return; 
			}
			setSession(req, res, result.rows[0].user_id);
			res.redirect('home.html');
		});	
	})
	
	/* CREATE ACCOUNT */
	.post('/create_account', (req, res) => {
		let username = req.body.username;
		let password = req.body.password;  
		let valid = true;

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
		})
	})
	
	/* SIGN UP */
	.get('/signup', (req, res) => {
		const params = {error: undefined};
		res.render('signup', params);
	})
	
	/* LOG OUT */
	.get('/logout', (req, res) => {
		sessions.delete(req.cookies.session);
		for (var prop in req.cookies) {
			if (!req.cookies.hasOwnProperty(prop)) {
				continue;
			}    
			res.cookie(prop, '', {expires: new Date(0)});
		}
		res.redirect('/');
	})
	
	/* LOAN */
	.get('/loan', (req, res) => {
		validateSession(req, res);
		const params = {error: undefined};
		res.render('signup', params);
	})
	
	/* REQUEST LOAN */
	.post('/request_loan', (req, res) => {
		let userID = getAuthenticatedUserID(req, res);
		let amount = req.body.amount;
		let collateral_count = req.body.collateral_count;
		let data = [];
		for (let i = 0; i < collateral_count; ++i){
			data.push({
				make:req.body[`make${i}`],
				model:req.body[`model${i}`],
				year:req.body[`year${i}`],
				value:req.body[`value${i}`],
				vin:req.body[`vin${i}`],
			});
		}
		pool.query("INSERT INTO loan_request(user_id,amount,data) VALUES($1,$2,$3)",[userID, amount, JSON.stringify(data)], function (err, result){
         
         if (collateral_count >0){
            pool.query("INSERT INTO forms(signed, form_type,user_id) VALUES($1,$2,$3)", [false, form_type.secured ,userID], function (err, result){});
         }
         else{
            pool.query("INSERT INTO forms(signed, form_type,user_id) VALUES($1,$2,$3)", [false, form_type.unsecured ,userID], function (err, result){});
         }
         const params = {amount};
         res.render('loanresult', params);
		});
	})
	/* forms */
	.get('/form', (req, res) => {
		let userID = getAuthenticatedUserID(req, res);
      
	})
	.listen(port, function() {
		console.log('Node app is running on port', port);
	});

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
	let session = req.cookies.session;
	
	if (!sessions.has(session)){
		res.redirect('noauth.html');
		res.end();
		throw new Error("Not logged in.");
	}
}