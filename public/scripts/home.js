window.onload = function(){
    document.getElementById("record").addEventListener("click",()=>{
        localStorage.about_to_record = !eval(localStorage.about_to_record)
        if(eval(localStorage.about_to_record)){
            document.getElementById("record").innerText = "the next run will be recorded"
        }else{
            document.getElementById("record").innerText = "the next run will not be recorded"
        }
    })
}