




// https://dev.to/lucpattyn/easy-multiparty-video-conferencing-with-simple-peer-webrtc-library-2p52





function peerCreated(peerid, peer){
    
    peer.peerid = peerid; // you can choose to skip this

    //debugger;

    peer.on('connect', function () {
        console.log('CONNECT')
        peer.send('call established .. ' + selfID);
    });
    
    peer.on('error', function (err) { console.log('error', err) });
    

    peer.on('data', function (data) {
        console.log('data: ' + data)
    });

    peer.on('stream', function (stream) {
        console.log('new stream arrived .. ', this.peerid); 
        
        createRemoteVideoElement(peerid, stream);
            
    });

    peer.on('track', function (track, stream) {
        console.log('new track arrived .. ', this.peerid);  
        
        createRemoteVideoTrackElement(peerid, track, stream);
            
    });


    peer.on('removestream', function (stream) {
        //removeRemoteVideoElement(peerid); 
        console.log("stream removed .. ", peerid); // hardly called

    });

    peer.on('close', function () {
        console.log("connection closed .. ", peerid);
        removeRemoteVideoElement(peerid);
    
    });
}