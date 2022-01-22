function styled_alert(status, message){
    if(status){
        document.getElementById("alert_container").style.backgroundColor= "#80FF82"
    }else{
        document.getElementById("alert_container").style.backgroundColor= "#FF5773"
    }
    document.getElementById("alert_container").style.display= "block"
   document.getElementById("message").innerText = message
}
window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("close").addEventListener("click",()=>{
        document.getElementById("alert_container").style.display= "none"
    })
    document.addEventListener('paste', (event) => {
        event.preventDefault();
    });
    document.addEventListener('copy', (event) => {
        event.preventDefault();
    });
  
    document.title = "SpeedCoding"
    if (location.protocol !== 'https:') {
        location.replace(`https:${location.href.substring(location.protocol.length)}`);
    }
    if(location.href.substring(0,location.href.length-location.pathname.length) == "https://speedcoding--atticuskuhn.repl.co"){
        location.replace(`https://speedcoding.atticuskuhn.repl.co${location.pathname}`)
    }
})

function documentTitle(e){
    console.log(e)
}