const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

// tell it to use the public directory as one where static files live
app.use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => {
       	const params = {error: undefined};
         res.render('signin', params);
    } )
    .post('/login', getLogin)
    .post('/create_account', getsignup)
    .get('/signup', (req, res) => {
       	const params = {error: undefined};
         res.render('signup', params);
    } )
    .listen(port, function() {
  console.log('Node app is running on port', port);
});



function getLogin(req, res) {
   let username = req.query.username;
   let password = req.query.password;  
   
	const params = {username};

	res.redirect('home.html');

}
function getsignup(req, res) {
   let username = req.query.username;
   let password = req.query.password;  
   
      const params = {error: undefined};
      res.render('signin', params);

}