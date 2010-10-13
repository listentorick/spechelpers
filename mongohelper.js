
var Db = require('./lib/node-mongodb-native/lib/mongodb/db').Db,
ObjectID = require('./lib/node-mongodb-native/lib/mongodb/bson/bson').ObjectID,
Server = require('./lib/node-mongodb-native/lib/mongodb/connection').Server;


module.exports = function MongoHelper() {

	return {

		createPrimaryKey:  function() {
			return ObjectID.createPk();
		},

		removeDataFromCollection: function (host, port, database, collectionName, closeConnectionAfterRemoval, callback) {
			var db = new Db(database, new Server(host, port, {auto_reconnect: true}, {strict:true}));
			db.open(function(){});
			
			if(!collectionName.length) {
				collectionName = [collectionName];
			}
			
			var bundle = new Bundle();		
					
			collectionName.forEach(function(collName,index) {
			
				bundle.add(function(collName) {
					return function(callback) {
					
						db.collection(collectionName, function(error, collection) {
							 if(error) {
								db.close();
								callback(error);
							 } else {
								 collection.remove(function(error,result) {
									if(closeConnectionAfterRemoval) db.close();
									callback(error, result);
								 });
							 }
						})
					}
				
				}(collName));
				
			});
			
			bundle.execute(callback);
		},

		/**
		* Removes data from the collection and then insert the provided data.
		*/
		addTestDataToMongo: function(host, port, database, collectionName, dataConstructor, callback) {

			var db = new Db(database, new Server(host, port, {auto_reconnect: true}, {strict:true}));
			db.open(function(){});
			db.collection(collectionName, function(error, collection) {
				
				if(error) {
					db.close();
					callback(error,null);
				} else {
					var data = dataConstructor();
					collection.insert(data, function(error, result) {
						if(error) {
							db.close();
							callback(error,null);
						} else {
							db.close();
							callback(null,result);
						}
					});
				}
			});
			
		}
	}

}



