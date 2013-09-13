
/*
 * GET home page.
 */

var mongoose = require( 'mongoose' );
var Employee = mongoose.model( 'Employee' );
var postmark = require("postmark")("a74fec21-8222-49e9-a896-641942e4177a");

var numberOfBringers = 2;

/*exports.index = function(req, res){
	res.render('index', { title: 'Express' });
};*/

exports.index = function(req, res){
	Employee.
	find().
	sort('latestDelivery').
	exec(function ( err, employees, count) {
		res.render('employee', {
			title: "Employees",
			employees: employees
		});
	});
};

exports.create = function(req, res){
	res.render('index');
};

exports.createEmployee = function(req, res){
	new Employee({
		name : req.body.name,
		email : req.body.email,
		latestDelivery : ''
	}).save( function( err, todo, count ){
    	res.redirect('/');
  	});
};

exports.markdelivery = function(req, res){
	Employee.findById( req.params.id, function ( err, employee ){
		employee.latestDelivery = Date.now();
		employee.save( function ( err, employee, count ){
      		res.redirect('/');
    	});
	});
};

exports.destroy = function ( req, res ){
  Employee.findById( req.params.id, function ( err, employee ){
    employee.remove( function ( err, employee ){
      res.redirect('/');
    });
  });
};

exports.sendremindertobringer = function(req, res){
	Employee.
	find({}).
	sort('latestDelivery').
	limit(numberOfBringers).
	exec(function ( err, bringers, count) {
		bringers.forEach(function (bringer) {
			postmark.send({
				"From": "Morgenmad <lund@telenor.dk>",
				"To": bringer.email,
				"Subject": "Du skal have morgenmad med på fredag", 
				"TextBody": "Husk at du skal have morgenmad med på fredag",
				"Tag": "reminderToBringer"
		  	}, function(error, success) {
		    	if(error) {
		        	console.error("Unable to send via postmark: " + error.message);
		        	return;
		    	}
		    	console.info("Sent to postmark for delivery")
	    	});
    	});

    	res.render('remindersent', {
			title: "Huskemail sendt",
			employees: bringers
		});
	});
};

exports.sendremindertoemployees = function(req, res){
Employee.
	find().
	sort('latestDelivery').
	exec(function ( err, employees, count) {
		var bringers = employees.slice(0, numberOfBringers);

		var recievers = employees.slice(numberOfBringers);

		recievers.forEach(function(employee){
			postmark.send({
					"From": "Morgenmad <lund@telenor.dk>",
					"ReplyTo": bringers[0].email, 
					"To": employee.email,
					"Subject": "Kommer du til morgenmad på fredag?", 
					"TextBody": "Jeg har morgenmad med på fredag, kommer du? Mvh " + bringers[0].name,
					"Headers": [{ "Name" : bringers[0].name}],
					"Tag": "reminderToEmployees"
		    	}, function(error, success) {
		    	if(error) {
		        	console.error("Unable to send via postmark: " + error.message);
		        	return;
		    	}
			    console.info("Sent to postmark for delivery")

		    	res.render('remindersent', {
					title: "Reminder sent",
					employees: employees
				});
			});
    	});
	});
};
