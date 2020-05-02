var SimplePeer = require('simple-peer');
var SimpleWebsocket = require('simple-websocket');
var EventEmitter = require('events').EventEmitter;
 
var peers = [];
var emitter = new EventEmitter();

var url = 'http://35.158.65.120:3210/'
 
module.exports = function() {
  var socket = new SimpleWebsocket('ws://35.158.65.120:3210');
  socket.on('close', function() { console.log('Socket closed'); });
  socket.on('error', function(err) { console.log('Socket error'); console.log(err); });
  socket.on('connect', function() { console.log('Connected'); });
 
  socket.on('data', function(data) { // add function to socker for when socket recieves data
    var rtc = new SimplePeer({ initiator: false, trickle: false }); // create new SimplePeer
 
    console.log(data);  // LIKELY: object provided by the shim is not JSON serializable, so you just need to have simple-peer pick the right properties off of it. 

    rtc.signal(data); // Pass data to rtc object, triggeres generation of signal data (needed to establish a connection)
    rtc.on('signal', function(data) { // event listener, signal 
      socket.send(data); // send data back over socket to client 
    });
 
    rtc.on('connect', function() { // when fitres, means connection established
      peers.push(rtc); // add new connection to peer list 
    });
 
    rtc.on('data', function(msg) { // listener for data 
      emitter.emit('message', msg);
 
      //as host, we need to broadcast the data to the other peers
      peers.forEach(function(p) {
        if(p === rtc) {
          return;
        }
 
        p.send(msg);
      });
    }); 
  });
 
  return {
    onReady: function(callback) {
        //the host is always "ready" although it may
        //not have any clients
        callback();  // callback passed by Connection Mananger
      },
   
      send: function(message) {
        peers.forEach(function(p) { p.send(message); });
      },
   
      onMessage: function(callback) {
        emitter.on('message', callback);  // callback passed by Connection Mananger
      }
  };
};