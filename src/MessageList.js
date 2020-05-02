var React = require('react');
 
var ChatMessage = require('./ChatMessage');

var createReactClass = require('create-react-class');
 
module.exports = createReactClass({
  render: function() {
    var messages = this.props.messages.map(function(msg) {
      return <ChatMessage message={msg} />;
    });
 
    return <div>{messages}</div>;
  }
});