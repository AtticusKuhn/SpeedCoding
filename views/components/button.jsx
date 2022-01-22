import React, { useState, useEffect } from 'react';
import {
  useLocation
} from "react-router-dom";


const PageLinkStyle = {
    "color":"black",
    "marginLeft":"1vw",
    "marginRight":"1vw",
    "marginTop":"3vh",
    "marginBottom":"3vh",
    "textDecoration":"none",
    "border":"1px dotted black",
    "borderRadius":"3%"
}
const PageLinkStyleActive = {
    "cobackgroundColorlor":"red"
}

class PageLink extends React.Component {
   
  render() {
      
   return <>
    	<a onClick={() => { console.log("ee") }}style = {PageLinkStyle} href = {this.props.link ? this.props.link:this.props.name }>  {this.props.name}</a>
    </>
  }
}
export default PageLink
