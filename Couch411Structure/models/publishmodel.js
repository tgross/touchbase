var uuid 				= require("uuid");
var forge 				= require("node-forge");
var publishBucket		= require("../app").publishBucket;
var publishBucketName	= require("../config").couchbase.publishBucket;
var N1qlQuery 			= require('couchbase').N1qlQuery;

function Publish() { };

Publish.create = function(params, callback) {
	var currentTime = new Date().ISOString();
	var publishDoc = {
		time: currentTime,
		publishID: (uuid.v4() + "_pub_" + publishDoc.type),
		title: params.title,
		author: params.author,
		type: params.type,
		hyperlink: params.webpage,
		blurb: params.blurb
	}
	var insertPub = N1qlQuery.fromString('INSERT INTO ' + publishBucket + ' (KEY, VALUE) VALUES ($1, $2)');
    publishBucket.query(insertPub, [publishID.publishID, publishDoc], function (err, result) {
    	if (err) {
    		callback(error, null);
    		return;
    	}
    	callback(null, {message: "success", data: result});
    });
};



module.exports = Publish;