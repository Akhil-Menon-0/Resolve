import React from 'react'
import Moment from 'react-moment';


class ChatMessageItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        let messageType = this.props.currentUser === this.props.message.sender ? 'Sender' : 'Receiver'
        return (
            <React.Fragment>
                <div className={messageType}>
                    {this.props.message.content}
                    <br />
                    <span className="timeStamp"><i><Moment fromNow>{this.props.message.timestamp}</Moment></i></span>
                </div>
                <br></br>
            </React.Fragment>
        )
    }
}

export default ChatMessageItem

