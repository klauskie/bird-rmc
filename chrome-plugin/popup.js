const url='http://localhost:8080/session';


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('bird-start-btn').addEventListener('click', onclick, false)
    function onclick() {

        const data = {
            website: window.location.hostname,
	        ip: ""
        }

        const req = new XMLHttpRequest();
        req.open("POST", url, true);
        req.setRequestHeader("Content-type", "application/json");
        req.send(data);
    
        req.onload = function(e) { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                let res = JSON.parse(req.responseText)
                let code = res.sessionID
                console.log("Code: " + code);
                document.getElementById('bird-code').innerHTML = code

                chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, code)
                })
            }
        }
    }

}, false)