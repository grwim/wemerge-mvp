var ReactDOM = require('react-dom');
var React = require('react');
 
var Chat = require('./Chat');
 
ReactDOM.render(
  <Chat />,
  document.getElementById('app')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
