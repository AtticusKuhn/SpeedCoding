let Output = ""
console.logMsg = console.log
console.log = data => {
    Output = `${Output}\n${data}\n`
}


window.onload=function(){
    $("#editor").attr("ondrop","return false;");
    if(localStorage.language){
       document.getElementById("language_button").innerText =  localStorage.language
    }


    if(eval(localStorage.about_to_record)){
        let vidSave = document.getElementById('vid2');
        vidSave.style.display = "block"
        navigator.mediaDevices.getDisplayMedia()
        .then(function(mediaStreamObj) {
            
            let mediaRecorder = new MediaRecorder(mediaStreamObj);
            let chunks = [];
            localStorage.about_to_record = false
            mediaRecorder.start();
            document.getElementById("submit").addEventListener('click', (ev)=>{
                mediaRecorder.stop();
                console.log(mediaRecorder.state);
            });
            mediaRecorder.ondataavailable = function(ev) {
                chunks.push(ev.data);
            }
            mediaRecorder.onstop = (ev)=>{
                let blob = new Blob(chunks, { 'type' : 'video/mp4;' });
                chunks = [];
                let videoURL = window.URL.createObjectURL(blob);
                vidSave.src = videoURL;
            }
        })
        .catch(e=>{
            vidSave.style.display = "none"
            localStorage.about_to_record = false
            styled_alert(false,"we could not record your run")
        })
    }
    document.getElementById("language_button").addEventListener("click",()=>{
        if(!timer_stopped){
            if(localStorage.language == "python"){
                localStorage.language = "javascript"
                document.getElementById("language_button").innerText = "javascript"
                document.getElementById("language_button").style.backgroundColor = "#f2da1d"
                document.getElementById("language_button").style.color ="black"

                editor.session.setMode("ace/mode/" + "javascript")

            }else if(localStorage.language == "javascript"){
                localStorage.language = "php"
                document.getElementById("language_button").innerText = "php"
                document.getElementById("language_button").style.backgroundColor = "grey"
                document.getElementById("language_button").style.color ="black"

                editor.session.setMode("ace/mode/" + "php")
            }else if(localStorage.language == "php"){
                localStorage.language = "go"
                document.getElementById("language_button").innerText = "go"
                document.getElementById("language_button").style.backgroundColor = "blue"
                document.getElementById("language_button").style.color ="black"

                editor.session.setMode("ace/mode/" + "golang")
            }else{
                localStorage.language = "python"
                document.getElementById("language_button").innerText = "python"
                document.getElementById("language_button").style.backgroundColor = "#396d9a"
                document.getElementById("language_button").style.color ="#f9cb3f"
                editor.session.setMode("ace/mode/" + "python")
            }
        }
    })

    document.addEventListener("copy",(e)=>{
        e.preventDefault()
    })
    document.addEventListener("paste",(e)=>{
        e.preventDefault()
    })


if(!(localStorage.name && localStorage.session_id)){
    styled_alert(false, "WARNING: This run will not be recorded because you are not logged in")

}
    fetch("/challenges", {
    method: "post",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        act:"get_random_challenge",
        name: localStorage.name ,
        session_id: localStorage.session_id
    })
    })
    .then( response => response.json()  )
    .then(json=>{
        if(!json.success){
            styled_alert(json.success, json.msg)
            document.getElementById("challenge_body").style.display = "none"
        }else{
            if(json.time_key){
                localStorage.time_key = json.time_key
            }else{
                document.getElementById("submit").style.display = "none"
                
            }

            document.getElementById("challenge_container").innerText = json.challenge
            document.getElementById("description").innerText = `description: ${json.description}`
            document.getElementById("sample_input").innerText = `sample input: ${json.public_input}`
            document.getElementById("sample_output").innerText = `sample output: ${json.public_output}`
            
            json = json["leaderboard"]
            json_array = Object.keys(json)
            json_array.sort((a,b)=>{json[a]-json[b]})
            for(i=0;i<json_array.length;i++){
                document.getElementById("challenge_leaderboard_table").innerHTML +=`
                    <tr>    
                        <td>${i+1}</td>
                        <td>${json_array[i]}</td>
                        <td>${json[json_array[i]]}</td>
                    </tr>    
                `        
            }
            if(json_array.length == 0){
                document.getElementById("challenge_leaderboard_table").innerHTML +=`
                    <tr>    
                        <td>1</td>
                        <td>AtticusKuhn</td>
                        <td>${document.getElementById("challenge_container").innerText.length*16457}</td>
                    </tr>    
                `  
            }

        }
    })
/*}else{
    styled_alert(false, "WARNING: This run will not be recorded because you are not logged in")
}*/


    let timer_stopped = false
    const editor_container = document.getElementById("editor")

    let editor = ace.edit(editor_container, {
        mode: localStorage.language == "go" ? "golang" :`ace/mode/${localStorage.language || "javascript"}`,
        theme: "ace/theme/textmate",

        fontFamily: "Roboto Mono",
        fontSize: 15,
        cursorStyle: "smooth",

        showPrintMargin: false,
        autoScrollEditorIntoView: true,
        useWorker: false
    })

    document.getElementById("submit").addEventListener("click",()=>{
        if(!timer_stopped){
            if(localStorage.session_id){
                fetch("/challenges", {
                    method: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        act:"submit_code",
                        language:localStorage.language || "javascript",
                        name: localStorage.name ,
                        session_id: localStorage.session_id,
                        challenge: document.getElementById("challenge_container").innerText.trim() ,
                        code:editor.getValue(),
                        time_key: localStorage.time_key
                    })
                })
                .then( response => response.json()  )
                .then(json=>{
                    if(json.success){
                        timer_stopped = true
                        document.getElementById("submit").innerText = "Get Another Challenge"
                    }
                    styled_alert(json.success, json.msg)
                })
            }else{
                styled_alert(false, "you must be logged in to submit a challenge")
            }
    }else{
        //location.reload()
    }
    })

    resize_editor(editor)
    $("textarea").attr("ondrop","return false;");


    onresize = () => {
        resize_editor(editor)
    }

    document.getElementById("test_locally").addEventListener("click",()=>{
        if(!timer_stopped){
            if(!localStorage.language || localStorage.language == "javascript"){
                try{
                    input = document.getElementById("sample_input").innerText.substring(14)
                    eval(editor.getValue())
                    if(Output== ""){
                        Output = "(no output)"
                    }
                    styled_alert(true, Output)
                    Output = ""
                }catch(e){
                    styled_alert(false, e)
                    Output = ""
                }
            }else{
                fetch("/challenges", {
                    method: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        act:`test_${localStorage.language}_code`,
                        name: localStorage.name ,
                        session_id: localStorage.session_id,
                        challenge: document.getElementById("challenge_container").innerText.trim() ,
                        code:editor.getValue(),
                        time_key: localStorage.time_key
                    })
                    })
                    .then( response => response.json()  )
                    .then(json=>{
                        styled_alert(json.success,json.msg)
                    })
            }
        }
    })
    // incrememnt timer
    function increment_timer(){
        setTimeout(()=>{
            if(!timer_stopped){
                document.getElementById("display_time").innerText = Number(document.getElementById("display_time").innerText)+10
                increment_timer()


            }
            if(!document.hasFocus() && !eval(localStorage.about_to_record)){
                timer_stopped = true
                styled_alert(false,"This run has been cancelled because you left the tab")
                localStorage.time_key =""
            }
            navigator.clipboard.writeText("no copying allowed").then(function() {
            }, function(err) {
            });
        },10)
    }
    increment_timer()

}
    

    
function resize_editor(editor) {
    if (innerWidth >= 800) {
        editor.renderer.setScrollMargin(2)
        editor.setOption("fontSize", 16)
    } else if (innerWidth >= 600) {
        editor.renderer.setScrollMargin(1.5)
        editor.setOption("fontSize", 13)
    } else {
        editor.renderer.setScrollMargin(1)
        editor.setOption("fontSize", 10)
    }
}


