var EventEmitter = require('events').EventEmitter;
 
var emitter = new EventEmitter();
 
var messages = [];
 
module.exports = {
  getMessages: function() {
    return messages.concat(); // return copy
  },
 
  subscribe: function(callback) {
    emitter.addListener('update', callback);
  },
 
  unsubscribe: function(callback) {
    emitter.removeListener('update', callback);
  },
 
  newMessage: function(message) {
    messages.push(message);
    emitter.emit('update');
  }
};