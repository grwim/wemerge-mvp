var SimplePeer = require('simple-peer');
var SimpleWebsocket = require('simple-websocket');
var EventEmitter = require('events').EventEmitter;
var Buffer = require('buffer/').Buffer;
 
var peers = [];
var emitter = new EventEmitter();

var url = 'http://35.158.65.120:3210/'
 
module.exports = function() {
  var socket = new SimpleWebsocket('ws://35.158.65.120:3210');
  socket.binaryType = 'arraybuffer';

  socket.on('close', function() { console.log('Socket closed'); });
  socket.on('error', function(err) { console.log('Socket error'); console.log(err); });
  socket.on('connect', function() { console.log('Connected!'); // can add 'X joined' message here 
    });

var localStream = null;

// // * TO RELOCATE
// // get video/voice stream
// navigator.getUserMedia({ video: true, audio: true }, gotMedia, function () {})

// // This method starts of proceedings
// function gotMedia (ownstream) {

//     localStream = ownstream;
    
//     // TODO - integrate my code here https://www.dmcinfo.com/latest-thinking/blog/id/9852/multi-user-video-chat-with-webrtc
//     // socket(); // once socket connects we receive "app.peer" on hub


//     var video = document.getElementById('me');
//         video.srcObject = ownstream;
//         video.play();
// }
// // * END TO RELOCATE

  socket.on('data', function(buf) { // add function to socket for when socket recieves data about a new peer from the handshake server
    var rtc = new SimplePeer({ initiator: false, trickle: false }); // create new SimplePeer
    // TODO: pass stream option to SimplePeer constructor 
 
    var data = JSON.parse(buf.toString());  // decode from binary 
    console.log('socket.on data', data);
    rtc.signal(data); // Pass signal data to rtc object to create sdp answer(needed to establish a connection with remote peer)  https://github.com/feross/simple-peer/tree/v6.1.5#peersignaldata
    rtc.on('signal', function(sdp_answer) { // event listener, sdp_answer recieved from rtc.signal(sdp_offer)
      var buf = Buffer.from(JSON.stringify(sdp_answer));
      console.log('rtc.on signal data created', sdp_answer);
      socket.send(buf); // send signal buf back over socket to client (peer)
    });
 
    rtc.on('connect', function() { // when fires, means connection established
      console.log('rtc.on connect - connection established');
      peers.push(rtc); // add new connection to peer list 
      emitter.emit('new-peer', rtc);
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
    
    // // NOTE: For two-way video, simply pass a stream option into both Peer constructors.
    // rtc.on('stream', stream => {  // TODO: should this go in client? host? both? probably both, but any differences?
    //   // got remote video stream, now let's show it in a video tag 
    //   // var video = document.querySelector('video')  // TODO: map to component
    //   // console.log('new stream arrived .. ', this.peerid);
    //   console.log('new stream arrived .. ');

    //   // createRemoteVideoElement(peerid, stream); 

    //   if ('srcObject' in video) {
    //     video.srcObject = stream
    //   } else {
    //     video.src = window.URL.createObjectURL(stream) // for older browsers
    //   }
   
    //   video.play()
    // });

    // peer.on('stream', function (stream) {
    //   console.log('new stream arrived .. ', this.peerid); 
      
    //   createRemoteVideoElement(peerid, stream);
    // });

    // peer.on('track', function (track, stream) {
    //     console.log('new track arrived .. ', this.peerid);  
        
    //     createRemoteVideoTrackElement(peerid, track, stream);  
    // });

    // peer.on('removestream', function (stream) {
    //     //removeRemoteVideoElement(peerid); 
    //     console.log("stream removed .. ", peerid); // hardly called
    // });

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