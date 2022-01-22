fetch("/apileaderboard")
.then( response => response.json()  )
.then(json=>{
    json = json["leaderboard"]
    let json_array = Object.keys(json)
    json_array.sort((a,b)=>json[b].points- json[a].points)
    console.log(json,json_array)
    for(i=0;i<Math.min(json_array.length,3);i++){
       
    document.getElementById("leaderboard_table").innerHTML +=`
        <tr>    
            <td><a href = "repl.it/@${json_array[i]}">${json_array[i]}</a></td>
            <td>${json[json_array[i]].points}</td>
            <td>${i}</td>
            <td> <img class ="small_img" src = "${json[json_array[i]].pfp}" /></td>
        </tr>    
        `        
    }

    if(json_array.length > 3){
        document.getElementById("load_more").style.display = "block"
        document.getElementById("load_more").addEventListener("click",()=>{
            for(i=3;i<json_array.length;i++){
                document.getElementById("leaderboard_table").innerHTML +=`
                    <tr>    
                        <td><a href = "repl.it/@${json_array[i]}">${json_array[i]}</a></td>
                        <td>${json[json_array[i]].points}</td>
                        <td>${i}</td>
                        <td> <img class ="small_img" src = "${json[json_array[i]].pfp}" /></td>
                    </tr>    
                    `        
                }
                document.getElementById("load_more").style.display = "none"

        })
    }
})