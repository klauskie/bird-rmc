var code = ""
var websocket;
let player;

const PLAY_PAUSE = "0"
const FULLSCREEN = "1"
const MUTE = "2"
const SKIP_BACK = "3"
const SKIP_FORWARD = "4"
const NEXT_VIDEO = "5"


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    code = request
    console.log("onMessage called")
    createWebSocketConnection(code)
})


function createWebSocketConnection(sessionID) {
    const url = 'ws://localhost:8080/ws/' + sessionID
    websocket = new WebSocket(url);
    console.log("======== websocket ===========", websocket);
    
    player = newPlayer()

    websocket.onopen = () => {
        console.log("Successfully Connected...")
    }

    websocket.onclose = (event) => {
        console.log("Socket closed connection")
    }

    websocket.onmessage = (msg) => {
        console.log(msg)
        //document.getElementById('firstHeading').innerText = msg.data
        handleCommandCode(msg.data)
    }

    websocket.onerror = (error) => {
        console.log("Socket Error: ", error)
    }
}

function handleCommandCode(actionCode) {
    switch (actionCode) {
        case PLAY_PAUSE:
            player.play()
            break;
        case FULLSCREEN:
            player.fullscreen()
            break;
        case MUTE:
            player.mute()
            break;
        case SKIP_BACK:
            player.skipBack()
            break;
        case SKIP_FORWARD:
            player.skipForward()
            break;
        case NEXT_VIDEO:
            player.nextVideo()
            break;
        default:
            break
    }
}

function newPlayer() {
    let website = window.location.hostname
    switch(website) {
        case "www.youtube.com":
            return new YoutubePlayer();
            break;
        case "www.netflix.com":
            return new NetflixPlayer();
            break
        default:
            return new PlayerCommands();
            break;
    }
}

class PlayerCommands {
    play() {
        console.log("PLAY")
    }
    
    fullscreen() {
        console.log("FULLSCREEN")
    }
    
    mute() {
        console.log("MUTE")
    }
    
    skipBack() {
        console.log("SKIPBACK")
    }
    
    skipForward() {
        console.log("SKIPFORWARD")
    }
    
    nextVideo() {
        console.log("NEXT")
    }
}

class YoutubePlayer extends PlayerCommands {
    play() {
        document.querySelector('.ytp-play-button.ytp-button').click();
    }
    
    fullscreen() {
        document.querySelector('.ytp-fullscreen-button.ytp-button').click();
    }
    
    mute() {
        document.querySelector('.ytp-mute-button.ytp-button').click();
    }
    
    skipBack() {
        document.querySelector('.ytp-doubletap-rewind-ve').click();
    }
    
    skipForward() {
        document.querySelector('.ytp-doubletap-fast-forward-ve').click();
    }
    
    nextVideo() {
        document.querySelector('.ytp-next-button.ytp-button').click();
    }
}

class NetflixPlayer extends PlayerCommands {
    play() {
        document.getElementById("netflixVideoPlayer").start()
    }
    
    fullscreen() {
        document.querySelector('.ytp-fullscreen-button.ytp-button').click();
    }
    
    mute() {
        document.querySelector('.ytp-mute-button.ytp-button').click();
    }
    
    skipBack() {
        document.querySelector('.ytp-doubletap-rewind-ve').click();
    }
    
    skipForward() {
        document.querySelector('.ytp-doubletap-fast-forward-ve').click();
    }
    
    nextVideo() {
        document.querySelector('.ytp-next-button.ytp-button').click();
    }
}
