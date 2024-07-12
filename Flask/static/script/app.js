var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('../../templates/irri.html');


const SerialPort = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");


const parsers = SerialPort.parsers;
const parser = new ReadlineParser({ delimeter: "\r\n" });

const port = new SerialPort.SerialPort({
  path: "COM3",
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});


port.pipe(parser);

parser.on("data", (data) => {
  console.log(data);
});

var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

var io = require('socket.io')(app);



io.on('connection', function(socket) {
    
    console.log('Node is listening to port');
    
});

parser.on('data', function(data) {
    
    console.log('Received data from port: ' + data);
    
    io.emit('data', data);
    
});

app.listen(4000);