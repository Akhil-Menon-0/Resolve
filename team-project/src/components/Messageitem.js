import React from "react"
import { Link } from "react-router-dom"
import Moment from 'react-moment';

class Messageitem extends React.Component {
    constructor(props) {
        super()
    }

    render() {
        return (
            <div className='dropdown-inner-'>
                <Link to={`/chat/${this.props.item.sender}/${this.props.item.sendername}`} exact="true" strict="true">
                    <li style={{ color: 'white', margin: '2%', width: '200px', wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                        Message from {this.props.item.sendername}
                        <br />
                        <span className="timeStamp"><i><Moment fromNow>{this.props.item.timestamp}</Moment></i></span>
                    </li>
                </Link>
                <hr style={{ background: 'white' }} />
            </div>
        )
    }
}
export default Messageitem