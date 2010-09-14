
function () {

	exports.getRequestBuilder = function(host, port, url, callback) {
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
	}

	exports.postRequestBuilder = function(host, port, url, content, callback) {

		var request = http.createClient(port, host).request("POST", url, {"Host": host, "Content-Length": content.length});
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
	}

	exports.assertStatus = function(code) {
		return function (e, res) {
			assert.equal (res.statusCode, code);
		};
	}

}