import React from 'react';
import Header from "./components/header.jsx"
class App extends React.Component {
  render() {
    return <>
			<Header/>
			<script  src="/public/scripts/login.js" />
            <h3>Login</h3>
                <div id="repl_auth" className="loginBrowser">

                    <iframe style = {{"width":"300px","height":"400px","border": "0","textAlign":"center"}} src="https://repl.it/auth_with_repl_site?domain=SpeedCoding.atticuskuhn.repl.co"></iframe>
                </div>
    </>;
  }
}

export default App;