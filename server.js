var  express =require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const path = require('path');
const app = express();
  app.use(express.static(path.join(__dirname, 'build')));
 
app.get('/*', function (req, res) {
	  console.log("request",req)
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
// let's set the port on which the server will run
app.set( 'port', 2014 );
// start the server
app.listen(
	app.get('port'),
	() => {
		const port = app.get('port');
		console.log('Server Running at http://127.0.0.1' + port );
	}
);

12