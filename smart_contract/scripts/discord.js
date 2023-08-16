//call API post
fetch('http://localhost:3001/confirm', {
method: 'POST',
headers: {
	"Content-type": "application/json"
},

body: JSON.stringify({
	"firstName": "John",
	"lastName": "Doe",
	"email": "doe.john@outlook.com",
	"password": "qwertyuiopl"
})
}).then(function(response) {
	return response.json();
}).then(function(data) {
	console.log('Request succeeded with JSON response', data);
}).catch(function(error) {
	console.log('Request failed', error);
});