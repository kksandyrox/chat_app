var httpd = require('http').createServer(handler);
var io = require('socket.io').listen(httpd);
var fs = require('fs');
var usernames = [];

httpd.listen(4000);

function handler(req, res) {
	fs.readFile(__dirname + '/index.html',
		function(err , data){
			if (err){
			res.writeHead(500);
			return res.end('Error');
		}
		res.writeHead(200);
		res.end(data);
		}
	);
}

io.sockets.on('connection' , function(socket){
	socket.on('clientMessage' , function(content){
		socket.emit('serverMessage' , 'You Said: ' + content);

		socket.get('username' , function(err , username) {
			if(!username){
				username = socket.id;
			}
			socket.broadcast.emit('serverMessage' , username + ' said: ' + content);
		});
		//http://www.crictime.com/cricket-streaming-live-1.htm
		
	});


socket.on('login' , function(username) {
	socket.set('username' , username , function(err) {
		if(err) { throw err;}
		if(!username){
			username = socket.id;
		}

		usernames.push(username);
		io.sockets.emit('serverUserMessage' , usernames);
		//showUsernames();

		socket.emit('serverMessage' , 'Logged in as ' + username);
		socket.broadcast.emit('serverMessage' , username + ' is online');
		//socket.broadcast.emit('serverUserMessage' , username + ' is online');
	});
});
	

socket.on('disconnect' , function(username){
	socket.get('username' , function(err , username){
		if(!username){
			username = socket.id;
		}
		console.log(username+ 'disconnected');
		socket.broadcast.emit('serverMessage' ,  username + ' left the conversation');
		//usernames.splice(usernames.indexOf(username), 1);
	});
});
socket.emit('login');
});
