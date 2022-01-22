import React from 'react';
import PageLink from './components/button.jsx'
import Header from "./components/header.jsx"
class App extends React.Component {
  render() {
    return <>
			<Header/>
            <link rel="stylesheet" href="/public/styles/challenges.css" />

            <script src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/ace.js"></script>
			<script  src="/public/scripts/challenges.js" />
            <div id ="challenge_body">
            <table id = "challenge_leaderboard_table">
                <tr>
                    <th>Rank</th>
                    <th>Member Name</th>
                    <th>Time</th>
                </tr>
            </table>

           <div id = "time_holder"> <div id ="display_time">0</div>ms taken</div>
            <h1 id="challenge_container" />
            <div id ="description" />
            <div id = "sample_input" />
            <div id = "sample_output" />
            <button id="language_button">javascript</button>
            <div id = "editor-content">
                <div id = "editor"></div>
                <div id = "editor-control"></div>
            </div>
            <button id = "submit">Submit Code</button> 
            <button id = "test_locally">Test your code locally</button> 
            </div>
            <video style={{"display":"none"}} id="vid2" controls></video>

    </>;
  }
}

export default App;