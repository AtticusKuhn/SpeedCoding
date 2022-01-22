// Arguments

let context = process.argv[2]
const code = process.argv[3]
context = context.split(",")
// Remove "dangerous" functions
let Output = []
console.logMsg = console.log
console.log = data => {
    if(typeof data == "string"){
        data =data.replace(/\s/g, "placeholder");
    }
    Output = [data,...Output]
}

process = undefined
require = undefined
// Eval

try {
    for(unguessable_variable_name=0;unguessable_variable_name<context.length;unguessable_variable_name++){
        input = context[unguessable_variable_name]
       /* eval(context[unguessable_variable_name])
        input = context[unguessable_variable_name]*/
        eval(code)
    }
    console.logMsg(Output)
} catch(error) {
    if (error.name && error.message) {
        console.logMsg(`${error.name}: ${error.message}`)
    } else {
        console.logMsg(error)
    }
}