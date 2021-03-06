var http = require('http'),
	assert = require('assert');


module.exports = function () {

	return {

		getRequestBuilder: function(host, port, url, callback) {
			var request = http.createClient(port, host);
			request = http.createClient(port, host).request("GET", url, {"Host": host});
			request.addListener('response', function (response) {
				var result= "";
				response.addListener("data", function (chunk) {
				  result+= chunk;
				});
				response.addListener("end", function () {  
					response.body = result;
					callback(null, response);
				}); 
			});
			request.end();
		},

		postRequestBuilder: function(host, port, url, content, contentType, callback) {

			var request = http.createClient(port, host).request("POST", url, {"Host": host, "Content-Length": content.length, "content-type": contentType });
			request.write(content);
			
			request.addListener('response', function (response) {
				var result= "";
				response.addListener("data", function (chunk) {
				  result+= chunk;
				});
				response.addListener("end", function () {  
					response.body = result;
					callback(null, response);
				}); 
			});
			request.end();
		},

		assertStatus: function(code) {
			return function (e, res) {
				assert.equal (res.statusCode, code);
			};
		}
	}

}