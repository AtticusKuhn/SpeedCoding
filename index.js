const express = require('express');
const reactViews = require('express-react-views');
const fs = require("fs")
const methods = require("./methods")
const app = express();
var bodyParser = require('body-parser');
const crypto = require("crypto")
const child_process = require("child_process")
const config = require("./config.js")
const axios = require("axios")
const qs = require("qs")
const process = require("process")
const FormData = require('form-data');
const fetch = require('node-fetch');
const secret_key = process.env.SECRET_KEY
// Create an encryptor:
var encryptor = require('simple-encryptor')(secret_key);







app.use('/public', express.static('public'));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactViews.createEngine());

app.get('/', (req, res) => {
	res.render('index');
})
app.get('/about', (req,res) => {
	res.render('about');
})
app.get('/challenge', (req,res) => {
	res.render('challenges');
})
app.get('/login', (req,res) => {
	res.render('login');
})
app.get('/leaderboard', (req,res) => {
	res.render('leaderboard');
})

app.get('/apileaderboard', async (req,res) => {
    const leaderboard =JSON.parse(fs.readFileSync("data/leaderboard.json"))
	res.json({leaderboard})
})
app.post("/challenges", (req,res) => {
    
    if(req.body.act =="get_random_challenge"){
        let challenge_json =JSON.parse(process.env.CHALLENGES_JSON)
        let challenges = Object.keys(challenge_json)
        let rand_num = Math.floor(challenges.length*Math.random())
        let leaderboard = JSON.parse(fs.readFileSync("data/leaderboard.json"))
        let challenge_leaderboard= {}
        for(person in leaderboard){
            challenge_leaderboard[person] = leaderboard[person]["completed"][challenges[rand_num]]
        }
        if(methods.verify_session(req.body.name,req.body.session_id)){
            
            let times= JSON.parse(fs.readFileSync("data/times.json"))
            let time_key = crypto.randomBytes(16).toString("hex")
            for(time in times){
                if(new Date().getTime() -times[time]["time"] > config.time_expire_limit){
                    delete times[time]
                }
            }
            times[time_key] = {
                "time":new Date().getTime(),
                "challenge":challenges[rand_num]
            }
            fs.writeFileSync("data/times.json", JSON.stringify(times, null, 4))
            
            res.json({
                success:true,
                challenge:challenges[rand_num],
                description:challenge_json[challenges[rand_num]].description,
                public_input:challenge_json[challenges[rand_num]].public_input,
                public_output:challenge_json[challenges[rand_num]].public_output,
                time_key:time_key,
                leaderboard:challenge_leaderboard
            })
        }else{
            res.json({
                success:true,
                msg:"You are not logged in, so this run will not be recorded ",
                challenge:challenges[rand_num],
                description:challenge_json[challenges[rand_num]].description,
                leaderboard:challenge_leaderboard
            })
        }
    }else if(req.body.act =="submit_code"){
        if(methods.verify_session(req.body.name,req.body.session_id)){
            const times = JSON.parse(fs.readFileSync("data/times.json"))
            if(times[req.body.time_key]){
                if(req.body.challenge == times[req.body.time_key]["challenge"]){
                const challenges = JSON.parse(process.env.CHALLENGES_JSON)
                if(challenges[req.body.challenge]){
                    let leaderboard = JSON.parse(fs.readFileSync("data/leaderboard.json"))

                    const input = challenges[req.body.challenge]["secret_input"]
                    if(leaderboard[req.body.name]){
                        if(req.body.language == "javascript"){
                        const a = child_process.spawn("node", ["./eval.js", input, req.body.code])

                        a.stdout.on("data", data => {
                        data = data.toString().trim()
                        data =data.replace(/\s/g, '');
                        data =data.replace(/placeholder/g, " ");
                        if(challenges[req.body.challenge]["secret_output"] == data){
                            if(!(new Date().getTime() - times[req.body.time_key]["time"] > leaderboard[req.body.name]["completed"][req.body.challenge]) ){
                                leaderboard[req.body.name]["completed"][req.body.challenge] = new Date().getTime() - times[req.body.time_key]["time"]
                                leaderboard[req.body.name]["points"] += 1
                                console.log("success")
                                res.json({
                                    success:true,
                                    msg:`success, your entry was submitted as ${new Date().getTime() - times[req.body.time_key]["time"]} ms. You gained 1 point for beating your previous time`
                                })
                            }else{
                                console.log("not PB")
                                res.json({
                                    success:true,
                                    msg:`You were successful, but did not beat your personal best of ${leaderboard[req.body.name]["completed"][req.body.challenge]}`
                                })
                            }
                            fs.writeFileSync("data/leaderboard.json", JSON.stringify(leaderboard, null, 4))
                            delete times[req.body.time_key]
                            fs.writeFileSync("data/times.json", JSON.stringify(times, null, 4))
                        }else{
                            console.log("incorrect")
                            res.json({
                                success:false,
                                msg:"You did not have the correct output"
                            })
                    }
                })
                a.stderr.on("data", data => {
                    data = data.toString().trim()
                    console.log("error")
                    res.json({
                        success:false,
                        msg:`there was an error in your code`
                    })
                })
                setTimeout(() => {
                    a.kill()
                    console.log("killed")
                    try{
                        res.json({
                            success:false,
                            msg:`Your code did not output anything`
                        })
                    }catch{}
                }, 300)
                }else if(req.body.language == "python"){
                    axios
                        .post("https://Eval-Server-With-Context.atticuskuhn.repl.co/tests/endpoint",JSON.stringify({
                            "code":req.body.code,
                            "secret_input":challenges[req.body.challenge]["secret_input"]}))
                        .then(response =>{
                            response.data = response.data.replace(/\n/g,'').split(',')
                            if(!isNaN(parseFloat(response.data[0]))){
                                response.data = response.data.map(Number)
                            }
                            response.data = JSON.stringify(response.data).replace(/"/g,"'")
                            console.log(response.data,challenges[req.body.challenge]["secret_output"] )
                             if(challenges[req.body.challenge]["secret_output"] == response.data){
                                if(!(new Date().getTime() - times[req.body.time_key]["time"] > leaderboard[req.body.name]["completed"][req.body.challenge]) ){
                                    leaderboard[req.body.name]["completed"][req.body.challenge] = new Date().getTime() - times[req.body.time_key]["time"]
                                    leaderboard[req.body.name]["points"] += 1
                                    console.log("success")
                                    res.json({
                                        success:true,
                                        msg:`success, your entry was submitted as ${new Date().getTime() - times[req.body.time_key]["time"]} ms. You gained 1 point for beating your previous time`
                                    })
                                }else{
                                    console.log("not PB")
                                    res.json({
                                        success:true,
                                        msg:`You were successful, but did not beat your personal best of ${leaderboard[req.body.name]["completed"][req.body.challenge]}`
                                    })
                                }
                                fs.writeFileSync("data/leaderboard.json", JSON.stringify(leaderboard, null, 4))
                                delete times[req.body.time_key]
                                fs.writeFileSync("data/times.json", JSON.stringify(times, null, 4))
                            }else{
                                console.log("incorrect")
                                res.json({
                                    success:false,
                                    msg:"You did not have the correct output"
                                })
                        }
                        })

                }else if(req.body.language == "php"){
                    axios.post('https://Php-eval.atticuskuhn.repl.co', qs.stringify({ code: req.body.code,secret_input:challenges[req.body.challenge]["secret_input"]}))
                    .then(response =>{
                        console.log(response.data)
                         response.data = response.data.toString().replace(/\n/g,'').split(',')
                          response.data = response.data.slice(1,response.data.length)
                            response.data = response.data.reverse()
                            if(!isNaN(parseFloat(response.data[0]))){
                                response.data = response.data.map(Number)
                            }                           
                            response.data = JSON.stringify(response.data).replace(/"/g,"'")
                            console.log(response.data,challenges[req.body.challenge]["secret_output"] )
                             if(challenges[req.body.challenge]["secret_output"] == response.data){
                                if(!(new Date().getTime() - times[req.body.time_key]["time"] > leaderboard[req.body.name]["completed"][req.body.challenge]) ){
                                    leaderboard[req.body.name]["completed"][req.body.challenge] = new Date().getTime() - times[req.body.time_key]["time"]
                                    leaderboard[req.body.name]["points"] += 1
                                    console.log("success")
                                    res.json({
                                        success:true,
                                        msg:`success, your entry was submitted as ${new Date().getTime() - times[req.body.time_key]["time"]} ms. You gained 1 point for beating your previous time`
                                    })
                                }else{
                                    console.log("not PB")
                                    res.json({
                                        success:true,
                                        msg:`You were successful, but did not beat your personal best of ${leaderboard[req.body.name]["completed"][req.body.challenge]}`
                                    })
                                }
                                fs.writeFileSync("data/leaderboard.json", JSON.stringify(leaderboard, null, 4))
                                delete times[req.body.time_key]
                                fs.writeFileSync("data/times.json", JSON.stringify(times, null, 4))
                            }else{
                                console.log("incorrect")
                                res.json({
                                    success:false,
                                    msg:"You did not have the correct output"
                                })
                        }
                    })
                }else if(req.body.language == "go"){
                    let message
                    if(req.body.code.includes("input")){
                        message = challenges[req.body.challenge]["secret_input"].split(",").map(e=>`input := ${e}
                        ${req.body.code}`).join("|")
                    /* message = `
                        input := ${challenges[req.body.challenge]["secret_input"].split(",")[0]}
                        ${req.body.code}
                        |
                        input := ${challenges[req.body.challenge]["secret_input"].split(",")[1]}
                        ${req.body.code}
                        `*/
                    }else{
                        message = challenges[req.body.challenge]["secret_input"].split(",").map(e=>`
                        ${req.body.code}`).join("|")
                    }
                    axios
                    .post("https://go-eval.atticuskuhn.repl.co",message)
                    .then(response =>{
                        console.log(response.data)
                        response.data = response.data.toString().replace(/\n/g,'').split(',')
                        response.data = response.data.slice(1,response.data.length)
                        response.data = response.data.reverse()
                        if(!isNaN(parseFloat(response.data[0]))){
                            response.data = response.data.map(Number)
                        }                           
                        response.data = JSON.stringify(response.data).replace(/"/g,"'")
                        console.log(response.data,challenges[req.body.challenge]["secret_output"] )
                        if(challenges[req.body.challenge]["secret_output"] == response.data){
                        if(!(new Date().getTime() - times[req.body.time_key]["time"] > leaderboard[req.body.name]["completed"][req.body.challenge]) ){
                            leaderboard[req.body.name]["completed"][req.body.challenge] = new Date().getTime() - times[req.body.time_key]["time"]
                            leaderboard[req.body.name]["points"] += 1
                            console.log("success")
                            res.json({
                                success:true,
                                msg:`success, your entry was submitted as ${new Date().getTime() - times[req.body.time_key]["time"]} ms. You gained 1 point for beating your previous time`
                            })
                        }else{
                            console.log("not PB")
                            res.json({
                                success:true,
                                msg:`You were successful, but did not beat your personal best of ${leaderboard[req.body.name]["completed"][req.body.challenge]}`
                            })
                        }
                            fs.writeFileSync("data/leaderboard.json", JSON.stringify(leaderboard, null, 4))
                            delete times[req.body.time_key]
                            fs.writeFileSync("data/times.json", JSON.stringify(times, null, 4))
                        }else{
                            console.log("incorrect")
                            res.json({
                                success:false,
                                msg:"You did not have the correct output"
                            })
                        }
                    })
                }else{
                    res.json({
                        success:false,
                        msg:"Unrecoginized coding lanugege"
                    }) 
                }

                
                }else{
                    res.json({
                        success:false,
                        msg:"Name doesn't exist"
                    })  
                }
            }else{
               res.json({
                success:false,
                msg:"Invalid Challenge Name"
            })  
            }
            }else{
               res.json({
                success:false,
                msg:"Time Key is for a different challenge"
            })  
            }
        }else{
           res.json({
                success:false,
                msg:"Time Key expired"
            }) 
        }
        }else{
            res.json({
                success:false,
                msg:"Invalid Session ID, try signing in again"
            })
        }
    }else if(req.body.act == "test_python_code"){
        const challenges = JSON.parse(process.env.CHALLENGES_JSON)
        if(req.body.challenge &&challenges[req.body.challenge]){
            axios
            .post("https://Eval-Server-With-Context.atticuskuhn.repl.co/tests/endpoint",JSON.stringify({
                "code":req.body.code,
                "secret_input":challenges[req.body.challenge]["public_input"]}))
            .then(response =>{
                console.log(response.data)
                res.json({
                    success:!response.data.toString().startsWith("failed: "),
                    msg:response.data
                })
            })
        }else{
            res.json({
            success:false,
            msg:"bad challenge"
        })
        }
    }else if (req.body.act == "test_php_code"){
        const challenges = JSON.parse(process.env.CHALLENGES_JSON)
        if(req.body.challenge &&challenges[req.body.challenge]){
        const data = new FormData();
        data.append('code', req.body.code);

        axios.post('https://Php-eval.atticuskuhn.repl.co', qs.stringify({ code: req.body.code,secret_input:challenges[req.body.challenge]["public_input"], test:"test" }))
        .then(response =>{
            res.json({
                success:!response.data.toString().startsWith("failed: "),
                msg:response.data
            })
        })
        }else{
              res.json({
            success:false,
            msg:"bad challenge"
        })
        }
    }else if (req.body.act == "test_go_code"){
        const challenges = JSON.parse(process.env.CHALLENGES_JSON)
        if(req.body.challenge &&challenges[req.body.challenge]){
            let message
            if(req.body.code.includes("input")){
            message = `
            input := ${challenges[req.body.challenge]["public_input"]}
            ${req.body.code}
            
            `
            }else{
            message = `
            ${req.body.code}
            
            `
            }
            axios
            .post("https://go-eval.atticuskuhn.repl.co",message)
            .then(response =>{
                res.json({
                    success:!response.data.toString().startsWith("failed: "),
                    msg:response.data
                })
            })
        }else{
              res.json({
            success:false,
            msg:"bad challenge"
        })
        }
    }else{
        res.json({
            success:false,
            msg:"bad method"
        })
    }
})
app.post("/login", async (req,res) => {
    if(req.headers["x-replit-user-name"]){
        let sessions = JSON.parse(fs.readFileSync("data/sessions.json"))
        const session_id = crypto.randomBytes(16).toString("hex")
        sessions[req.headers["x-replit-user-name"]] = encryptor.encrypt(session_id)
        fs.writeFileSync("data/sessions.json", JSON.stringify(sessions, null, 4))
        let leaderboard = JSON.parse(fs.readFileSync("data/leaderboard.json"))
        if(!leaderboard[req.headers["x-replit-user-name"]]){
            const url = 'https://repl.it/graphql';
        const data = {
                'operationName': 'userByUsername',
                'query': `
                query userByUsername($username: String!) {
                    userByUsername(username: $username) {
                        image
                    }
                }
                `,
                'variables': {
                    'username': req.headers["x-replit-user-name"]
                }
            }
        const config = {
            headers: {
                'X-Requested-With': 'bruh',
                'referer': 'https://repl.it'
            }
        };
        const res = await axios.post(url, qs.stringify(data), config);
        leaderboard[req.headers["x-replit-user-name"]] = {
                "points": 0,
                "completed": {}
            }
        if(res.data.data.userByUsername){
            leaderboard[req.headers["x-replit-user-name"]].pfp = {}
            leaderboard[req.headers["x-replit-user-name"]].pfp = res.data.data.userByUsername.image
            
        }
            fs.writeFileSync("data/leaderboard.json", JSON.stringify(leaderboard, null, 4))
        }
        res.json({
            success:true,
            name:req.headers["x-replit-user-name"],
            session_id:session_id
        })
    }else{
        res.json({
            success:false,
            msg:"No Header"
        })
    }
})
app.listen(() => console.log(`server is up!`));