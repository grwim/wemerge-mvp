// wrapper around websocket layer 

var SimpleWebsocket = require('simple-websocket')
var WebSocket = require('ws')

var url = 'http://35.158.65.120:3210/'

var socket = new SimpleWebsocket(url);

const ws = new WebSocket(url);

var hub = { 

    msgMap: {}, 
    
    connect:function connect(url){
        // easyrtcConnect(url);
    },
    
    send: function(peerid, msgType, content){
        // easyrtc.sendDataWS(peerid, msgType,  content);
        // Q: how to specifiy desitination / peerID with socket??

    },

    sendToAll: function(msgType, content){
        // easyrtc.sendDataWS({targetRoom:"default"}, msgType, content);
    },

    //  
    on: function(type, callback){
        this.msgMap[type] = callback;
    },

    
    event: function(peerid, type, msg){
        var callback = this.msgMap[type];
        if(callback){
            callback(peerid, msg);
        };      
    },


    peerMap: {},

    setPeer: function(peerid, peer){
        // this.peerMap[peerid] = peer;
    },
    
    getPeer: function(peerid){
        // return this.peerMap[peerid];
    },

    removePeer: function(peerid){
        //delete this.peerMap[peerid];
    },

    iteratePeers: function(callback){
        var value;
        for (var key in this.peerMap) {
                value = this.peerMap[key];
                callback(key, value);
        }
    }
    
};
