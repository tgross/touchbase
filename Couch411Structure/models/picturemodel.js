var uuid 				= require("uuid");
var forge 				= require("node-forge");
var userBucket			= require("../app").userBucket;
var pictureBucket		= require("../app").pictureBucket;
var userBucketName		= require("../config").couchbase.userBucket;
var userBucketName		= require("../config").couchbase.pictureBucket;
var N1qlQuery 			= require('couchbase').N1qlQuery;
var multer 				= require('multer');
var fs 					= require('fs');

function Picture() { };

Picture.upload = function(newID, params, callback) {
	if (params.picture) {
		var b64string = params.picture;
		if (b64string.search("data:image/jpg;base64") == -1 && b64string.search("data:image/jpeg;base64") == -1 && b64string.search("data:image/png;base64") == -1 && b64string.search("data:image/gif;base64") == -1) {
			callback(null, {status: 400, message: "ERROR: please use a valid image format (jpg, jpeg, png, gif)"});
			// is this callback appropriate??
		}
    	pictureBucket.insert((newID + "_pic"), params.picture, function (err, result) {
			if (err) {
			    callback(error, null);
			    return;
	  		}
			callback(null, {message: "success", data: result});		
		});
    }
    else {
    	var returnMessage = "no picture to upload; stock photo will be applied";
    	console.log(returnMessage);
    	callback(null, {message: "success", data: returnMessage});	
    }
};

Picture.attempt = function(picId, params, callback) {
	if (params.extension != 'png' && params.extension != 'jpg' && params.extension != 'jpeg' && params.extension != 'gif') {
		callback(null, {status: 400, message: "ERROR: please use a valid image format (jpg, jpeg, png, gif)"});
	}
	if(done==true) {
    	fs.readFile(params.path, function(error, data) {
    		if(error) {
    			callback(error, null);
    		}
    		// change uuid.v4() to the ID passed by cookie!
    		var base64data = new Buffer(data, 'binary').toString('base64');
    		pictureBucket.insert((uuid.v4()+"_picMulterNode"), base64data, function(issue, res) {
    			if(issue) {
    				callback(issue, null);
    			}
    			fs.unlink(params.path, function (err) {
					if (err) {
					  	callback(err, null);
					}
					console.log('successfully deleted /tmp/hello');
				});
    			callback(null, {message: "success", data: res});
    		});
    	});
  	}
};

Picture.receive = function(params, callback) {
	// params.hasPicture will be in user Document as a boolean; set to true upon upload of picture
	if (params.login.hasPicture) {
		pictureBucket.get((params.uuid + "_pic"), function (err, result) {
			if (err) {
			    callback(error, null);
			    return;
	  		}
			callback(null, {message: "success", data: result});		
		});
	}
	else {
		// there will be a default_pic chosen by the developer, which will exist in the database
		pictureBucket.get(("default_pic"), function (err, result) {	
			if (err) {
			    callback(error, null);
			    return;
	  		}
			callback(null, {message: "success", data: result});	
		});
	}
};

module.exports = Picture;