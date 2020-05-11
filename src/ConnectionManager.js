var EventEmitter = require('events').EventEmitter;
 
var ClientConnection = require('./ClientConnection');
var HostConnection = require('./HostConnection');  
 
var connection = null;
var emitter = new EventEmitter();
 
function setupConnection(conn) {
  conn.onReady(function() {  // pass same callback for host & client onReady
    connection = conn;  // TODO: why this shallow copy?
    emitter.emit('status');  // 
  });
 
  conn.onMessage(function(msg) { // pass same callback for host & client onMessage
    emitter.emit('message', msg);
  });
}
 
module.exports = {
  isConnected: function() {
    return connection !== null;
  },
 
  sendMessage: function(message) {
    connection.send(message);
  },
 
  onMessage: function(cb) {
    emitter.on('message', cb);
  },
 
  onStatusChange: function(cb) {  // allows for callback to be run when emitter obtains a status 
    emitter.on('status', cb);
  },
 
  offMessage: function(cb) {
    emitter.off('message', cb);
  },
 
  offStatusChange: function(cb) {
    emitter.off('status', cb);
  },
 
  host: function() {
    setupConnection(HostConnection());
  },
 
  join: function() {
    setupConnection(ClientConnection());
  }
};