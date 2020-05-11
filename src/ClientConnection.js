var SimplePeer = require('simple-peer');
var SimpleWebsocket = require('simple-websocket');
var EventEmitter = require('events').EventEmitter;
var Buffer = require('buffer/').Buffer;
 
var emitter = new EventEmitter();

// var url = 'http://35.158.65.120:3210/'
var url = 'ws://35.158.65.120:3210' 

module.exports = function() {

  var socket = new SimpleWebsocket(url); // socket to handshake server 
  var rtc;
  socket.on('close', function() { console.log('Socket closed'); });
  socket.on('error', function(err) { console.log('Socket error'); console.log(err); });
 
  socket.on('connect', function() {
    rtc = new SimplePeer({ initiator: true, trickle: false });
    rtc.on('signal', function(data) { // catch signal generation event 
      console.log('rtc signal');
      console.log(data);

      var buf = Buffer.from(JSON.stringify(data));
      socket.send(buf);
    });
 
    socket.on('data', function(buf) { // assume recieved data is response signal from host - data needed to establish rtc connection with host 
      var data = JSON.parse(buf.toString());
      console.log('socket.on data', data);
      rtc.signal(data); // establish connection 
    });
 
    rtc.on('connect', function() { 
      console.log('rtc.on connect - connection established');
      emitter.emit('connected');  // TODO: how's emitter work?
      
      socket.destroy();  // no longer need the signaler 
    });
 
    rtc.on('data', function(message) {
      emitter.emit('message', message);
    });
  });
 
  return {
    onReady: function(callback) {
      emitter.on('connected', callback);
    },
 
    send: function(message) {
      rtc.send(message);
    },
 
    onMessage: function(cb) {
      emitter.on('message', cb);
    }
  };
};