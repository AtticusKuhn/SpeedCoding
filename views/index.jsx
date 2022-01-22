import React from 'react';
import PageLink from './components/button.jsx'
import Header from "./components/header.jsx"
class App extends React.Component {
  render() {
    return <>
			<Header/>
            <script  src="/public/scripts/home.js" />

            <p> Speed code is the only site (as far as I know) to test your coding quickness</p>
            <p> go to random challenges to test your speed</p>
            <p> this site currently boasts over <strong>12 challenges</strong> </p>
            <p>New Feature! Record your runs to share with others             <button id = "record"> Record this run</button></p>
    </>;
  }
}

export default App;