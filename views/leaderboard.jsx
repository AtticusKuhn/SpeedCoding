import React from 'react';
import PageLink from './components/button.jsx'
import Header from "./components/header.jsx"
class App extends React.Component {
  render() {
    return <>
			<Header/>
			<script  src="/public/scripts/leaderboard.js" />
            <table id = "leaderboard_table">
                <tr>
                    <th>Member Name</th>
                    <th>Number of Points</th>
                    <th>Rank</th>
                    <th>PFP</th>
                </tr>
                

          
            </table>
            <button style ={{"display":"none"}} id = "load_more">Load More</button>
    </>;
  }
}

export default App;