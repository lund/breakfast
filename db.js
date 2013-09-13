var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 
var Employee = new Schema({
    name    : String,
    email    : String,
    latestDelivery : Date
});
 
mongoose.model( 'Employee', Employee );
 
mongoose.connect( process.env.MONGOHQ_URL );