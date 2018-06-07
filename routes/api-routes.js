// Requiring our Todo model
var db = require('../models');

var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google'
}

var geocoder = NodeGeocoder(options);

// Routes
// =============================================================
module.exports = function(app) {
	// GET route for getting all of the posts
	app.get('/api/posts/', function(req, res) {
		db.artists.findAll({}).then(function(dbArtist) {
			res.json(dbArtist);
		});
	});

	// Get route for returning(SORTING) posts of a specific location
	// The same route will be used to sort artists by other parameters
	app.get('/api/posts/location/:location', function(req, res) {
		db.artists
			.findAll({
				where: {
					location: req.params.location
				}
			})
			.then(function(dbArtist) {
				res.json(dbArtist);
			});
	});

 // Get route for returning(SORTING) posts of a specific stylePref
	// The same route will be used to sort artists by other parameters
	app.get('/api/posts/stylePref/:stylePref', function(req, res) {
		db.artists
			.findAll({
				where: {
					stylePref: req.params.stylePref
				}
			})
			.then(function(dbArtist) {
				res.json(dbArtist);
			});
	});



	// Get route for returning(SORTING) posts of a ASCENDING hourly rate
	// The same route will be used to sort artists by other parameters
	app.get('/api/posts/hourlyRate/highest', function(req, res) {
		db.artists
			.findAll({
				order: [
					sequelize.fn('isnull', sequelize.col('hourlyRate')),
					['hourlyRate', 'ASC']
				]
			})
			.then(function(dbArtist) {
				res.json(dbArtist);
			});
	});

	// Get route for returning(SORTING) posts of a DESCENDING hourly rate
	// The same route will be used to sort artists by other parameters
	app.get('/api/posts/hourlyRate/lowest', function(req, res) {
		db.artists
			.findAll({
				order: [
					db.sequelize.fn('isnull', db.sequelize.col('hourlyRate')),
					['hourlyRate', 'DESC']
				]
			})
			.then(function(dbArtists) {
				res.json(dbArtists);
			});
	});

	// changed to "/register", didnt work -- Tanner, thought since that route is where the db is posting on our page it would add it, but no. Also tried your route below, didn't work.
	// POST route for saving a new artist
	app.post('/api/posts', function(req, res) {
		console.log(req.body);
		db.artists
			.create({
				artistName: req.body.artistName,
				location: req.body.location,
				artistNumber: req.body.artistNumber,
				independent: req.body.independent,
				shopName: req.body.shopName,
				hourlyRate: req.body.hourlyRate,
				artistMin: req.body.artistMin,
				stylePref: req.body.stylePref,
				artistInsta: req.body.artistInsta,
				shopLink: req.body.shopLink,
				artistBio: req.body.artistBio
			})
			.then(function(dbArtists) {
				res.json(dbArtists);
			});
	});

	// get user address corresponding lat and lng from google api geocode
	app.get('/latlng/:address', function(req, res){

		geocoder.geocode(req.params.address)
		  .then(function(result) {
		    var Alat = result[0].latitude;
		    var Alng = result[0].longitude;

		    res.json({lat: Alat, lng: Alng});
		  })
		  .catch(function(err) {
		    console.log(err);
		  });
	})
};
