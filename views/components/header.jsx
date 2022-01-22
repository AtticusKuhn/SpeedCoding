import React from 'react';
import PageLink from "./button.jsx"
class Header extends React.Component {
  render() {
    return <div id = "header">
    		<script  src="/public/scripts/main.js" />
            <script src="https://kit.fontawesome.com/c5b223ec70.js" crossOrigin="anonymous"></script>
            <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossOrigin="anonymous"></script>
            <link rel="stylesheet" href="/public/styles/main.css" />
            <link href = "/public/images/Speedy_S.png" rel = "icon"/>
            <meta property = "og:type" content = "website"/>
            <meta property = "og:site_name" content = "SpeedCoding"/>
            <meta property = "og:title" content = "SpeedCoding"/>
            <meta property = "og:description" content = "Coding as fast as possible"/>
            <meta property = "og:image" content = "/public/images/Speedy_S.png"/>

			<div>
            <h1><img style ={{"height":"20vh","width":"12vw"}}src = "/public/images/SpeedCoding.png" /><img className = "small_img" src ="/public/images/Speed.png" /></h1>
            <PageLink name = "Home" link = "/" />
            <PageLink name = "leaderboard" />
            <PageLink name = "about" />
            <PageLink name = "login" />

            <PageLink name = "Get a Random Challenge" link = "challenge" />
            </div>
           
            
            <div id = "alert_container"><div id="message" /><button id="close">close</button>
            </div>

    </div>;
  }
}
export default Header