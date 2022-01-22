import React from 'react';
import Header from "./components/header.jsx"
class App extends React.Component {
  render() {
    return <>
        <Header/>
        <p>With codegolf being an established sport, it seems there is no though
        given to the more realistic thing to emphasize: time.
        It doesn't matter the length, as long as it works.
        </p>
        <p>This is a website for coding as fast as possible, with no regard for efficency.</p>
        <p> it is designed to emphasize thinking on your feet. </p>
        <p>It is important that all inputs be given by the varible "input", and all outputs be given by console.logging the result.</p>
        <p>If you choose to complete the challenges in Python, then the input is "input_variable", because input is already a builtin function in python
        .You can output answer by printing it.
        </p>
         <p>If you choose to complete the challenges in php, then the input is "$input"
        .You can output answer setting the variable $output.
        </p>
        <p>If you choose to complete the challenges in go, then the input is "input"
        .You can output answer by returning the answer.
        </p>
        <p> It was designed by <a href = "https://repl.it/@AtticusKuhn">AtticusKuhn</a>, and the eval engine was made by  <a href = "https://repl.it/@MrEconomical">MrEconomical</a></p>
    </>;
  }
}

export default App;