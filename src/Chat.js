var React = require('react');
 
var MessageList = require('./MessageList');
var MessageForm = require('./MessageForm');
var MessageStore = require('./MessageStore');
var ConnectionManager = require('./ConnectionManager');
var ConnectionForm = require('./ConnectionForm');

var createReactClass = require('create-react-class');
 
module.exports = createReactClass({
    getInitialState: function() {
        return {
            messages: MessageStore.getMessages(), // load list of messages
            connected: ConnectionManager.isConnected()
        };
    },
 
    componentDidMount: function() {
        MessageStore.subscribe(this.updateMessages);
        ConnectionManager.onStatusChange(this.updateConnection); // pass callback - update 'connected' from emiter.status
        ConnectionManager.onMessage(MessageStore.newMessage);
    },
 
    componentDidUnmount: function() {
        MessageStore.unsubscribe(this.updateMessages);
        ConnectionManager.offStatusChange(this.updateConnection);
        ConnectionManager.offMessage(MessageStore.newMessage);
    },
 
    updateMessages: function() {
        this.setState({
            messages: MessageStore.getMessages()
        });
    },
 
    updateConnection: function() {
        this.setState({
            connected: ConnectionManager.isConnected()
        });
    },
 
    onSend: function(newMessage) {
        ConnectionManager.sendMessage(newMessage);
        MessageStore.newMessage(newMessage);
    },
 
    render: function() {
        return <div>
            <MessageList messages={this.state.messages} />
            <MessageForm onSend={this.onSend} />
            <ConnectionForm
                connected={this.state.connected}
                onHost={ConnectionManager.host}
                onJoin={ConnectionManager.join}
                />
        </div>;
    }
});