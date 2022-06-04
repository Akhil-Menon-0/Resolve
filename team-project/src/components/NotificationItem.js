import React from "react"
import { Link } from "react-router-dom"
import Moment from 'react-moment';
import axios from "axios";

class NotificationItem extends React.Component {
    constructor(props) {
        super(props)
    }
    handleClick = () => {
        axios.get(`https://resolve4.herokuapp.com/auth/viewnotification/${this.props.item._id}`, { withCredentials: true, headers: { "Content-Type": "application/json" } })
            .then((res) => {
                this.props.remove(this.props.item._id)
                //window.location.reload()
            })
    }
    render() {
        if (this.props.item.type === "reply created") {
            return (
                <div className="dropdown-inner-" >
                    <a onClick={this.handleClick} className="dropdown-item-" id='myprofiledoubt' href={`https://resolve4.herokuapp.com/doubts/${this.props.item.doubt}`} ><li style={{ color: 'white', margin: '2%', width: '200px', wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                        You posted reply to doubt <strong>{this.props.item.doubt_title}</strong> <span style={{ marginLeft: '5%', fontStyle: 'italic', color: 'gray', fontSize: "x-small" }}><br /><Moment fromNow>{this.props.item.date}</Moment></span>
                    </li></a >
                    <hr style={{ backgroundColor: "white" }} />
                </div>

            )
        }
        else if (this.props.item.type === "doubt created") {
            return (
                <div className="dropdown-inner-" >
                    <a onClick={this.handleClick} className="dropdown-item-" id='myprofiledoubt' href={`https://resolve4.herokuapp.com/doubts/${this.props.item.doubt}`} >
                        <li style={{ color: 'white', margin: '2%', width: '200px', wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                            You posted a doubt <strong>{this.props.item.doubt_title}</strong> <span style={{ marginLeft: '5%', fontStyle: 'italic', color: 'gray', fontSize: "x-small" }}><br /><Moment fromNow>{this.props.item.date}</Moment></span>
                        </li></a >
                    <hr style={{ backgroundColor: "white" }} />
                </div>

            )
        }
        else if (this.props.item.type === "upvoted") {
            return (
                <div className="dropdown-inner-">
                    <a onClick={this.handleClick} className="dropdown-item-" id='myprofiledoubt' href={`https://resolve4.herokuapp.com/doubts/${this.props.item.doubt}`} ><li style={{ color: 'white', margin: '2%', width: '200px', wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                        {this.props.item.initiator_username} upvoted your reply to doubt <strong>{this.props.item.doubt_title}</strong> <span style={{ marginLeft: '5%', fontStyle: 'italic', color: 'gray', fontSize: "x-small" }}><br /><Moment fromNow>{this.props.item.date}</Moment></span>
                    </li></a >
                    <hr style={{ backgroundColor: "white" }} />
                </div>

            )
        }
        else if (this.props.item.type === "downvoted") {
            return (
                <div className="dropdown-inner-">
                    <a onClick={this.handleClick} className="dropdown-item-" id='myprofiledoubt' href={`https://resolve4.herokuapp.com/doubts/${this.props.item.doubt}`} ><li style={{ color: 'white', margin: '2%', width: '200px', wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                        {this.props.item.initiator_username} downvoted your reply to doubt <strong>{this.props.item.doubt_title}</strong> <span style={{ marginLeft: '5%', fontStyle: 'italic', color: 'gray', fontSize: "x-small" }}><br /><Moment fromNow>{this.props.item.date}</Moment></span>
                    </li></a >
                    <hr style={{ backgroundColor: "white" }} />
                </div>
            )
        }
        else {
            return (
                <div className="dropdown-inner-">
                    <a onClick={this.handleClick} className="dropdown-item-" id='myprofiledoubt' href={`https://resolve4.herokuapp.com/doubts/${this.props.item.doubt}`} ><li style={{ color: 'white', margin: '2%', width: '200px', wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                        {this.props.item.initiator_username} replied to your doubt <strong>{this.props.item.doubt_title}</strong> <span style={{ marginLeft: '5%', fontStyle: 'italic', color: 'gray', fontSize: "x-small" }}><br /><Moment fromNow>{this.props.item.date}</Moment></span>
                    </li></a >
                    <hr style={{ backgroundColor: "white" }} />
                </div>

            )
        }


    }
}


export default NotificationItem