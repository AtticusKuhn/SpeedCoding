document.addEventListener("DOMContentLoaded", () => {
    if (self !== top) {
        document.getElementById("repl_auth").className = "loginEmbed"
    } else {
        document.getElementById("repl_auth").className = "loginBrowser"
    }
    addEventListener("message", message => {
        if (message.data === "auth_complete") {
            fetch("/login", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    act:"login",
                })
            })
            .then( response => response.json()  )
            .then(json=>{
                if(json.success){
                    localStorage.name = json.name
                    localStorage.session_id = json.session_id
                }else{
                    styled_alert(json.success,json.msg)
                }
            })
        }
    })
})

