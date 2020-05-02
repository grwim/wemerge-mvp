var SimplePeer = require('simple-peer');
var SimpleWebsocket = require('simple-websocket');
var EventEmitter = require('events').EventEmitter;
 
var emitter = new EventEmitter();

// var url = 'http://35.158.65.120:3210/'
var url = 'ws://35.158.65.120:3210' 

module.exports = function() {

  var socket = new SimpleWebsocket(url); 
  var rtc;
  socket.on('close', function() { console.log('Socket closed'); });
  socket.on('error', function(err) { console.log('Socket error'); console.log(err); });
 
  socket.on('connect', function() {
    rtc = new SimplePeer({ initiator: true, trickle: false });

    rtc.on('signal', function(data) { // catch signal generation event 
      socket.send(data);
    });
 
    socket.on('data', function(data) { // assume recieved data is response signal from host 
      rtc.signal(data); // establish connection 
    });
 
    rtc.on('connect', function() { 
      emitter.emit('connected');  // TODO: how's emitter work?
      //we no longer need the signaler
      socket.destroy();
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