var React = require('react');
var createReactClass = require('create-react-class');
 
module.exports = createReactClass({
  render: function() {
    return <p>{this.props.message}</p>;
  }
});