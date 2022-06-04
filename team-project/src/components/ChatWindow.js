import React from "react"
import ChatMessageItem from "./ChatMessageItem"
import { Link } from "react-router-dom"
import { ProductConsumer } from './context'

class ChatWindow extends React.Component {
    constructor(props) {
        super()
        this.state = {
            person2: props.person2,
            person2name: props.person2name,
            newMessage: ''
        }
        this.send = this.send.bind(this)
        this.changehandler = this.changehandler.bind(this)
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    changehandler = (event) => {
        event.preventDefault()
        const { value } = event.target;
        this.setState({ newMessage: value });
    }

    send(socket, user, addmessage) {
        if (this.state.newMessage === "") { return }
        let temp = {
            sender: user._id,
            sendername: user.userName,
            receiver: this.state.person2,
            receivername: this.state.person2name,
            content: this.state.newMessage,
            timestamp: new Date()
        }
        this.setState({ newMessage: "" })
        socket.emit('message', temp)
        addmessage(temp)
    }

    render() {
        return (
            <ProductConsumer>
                {(object) => {
                    let curallmsgs = object.messages.filter((item, index) => {
                        if (item.sender === this.state.person2 || item.receiver === this.state.person2) { return true }
                        else { return false }
                    })
                    let curallmsgscomp = curallmsgs.map((item, index) => {
                        return (<ChatMessageItem message={item} currentUser={object.user._id} id={index} />)
                    })
                    return (
                        <React.Fragment>
                            <br />
                            <Link to={`/public_user_profile/${this.state.person2}`} exact="true" strict="true"><h2 className="text-center" id="fullname">{this.state.person2name}</h2></Link>
                            <br />
                            <div className="ChatBox">
                                <div>{curallmsgscomp}</div>
                                <div style={{ float: "left", clear: "both" }}
                                    ref={(el) => { this.messagesEnd = el; }}>
                                </div>
                            </div>
                            <div style={{ margin: 'auto', textAlign: 'center' }}>
                                <input style={{ marginTop: '10px', backgroundColor: "#293c6f", color: "#d8faff", width: '70%', border: "none" }} value={this.state.newMessage} type='text' placeholder="Send a message" name="newMessage" onChange={this.changehandler} onKeyPress={(e) => { if (e.key === "Enter") { this.send(object.socket, object.user, object.addmessage) } }} />
                                <div type='button' className='btn btn-primary' style={{ textAlign: 'right', margin: "3%" }} onClick={() => { this.send(object.socket, object.user, object.addmessage) }}><strong>SEND</strong></div>
                            </div>
                            <h6 className="text-center" id="fullname"><i>This chat will not be saved</i></h6>
                        </React.Fragment>
                    )
                }}
            </ProductConsumer>
        )
    }
}
export default ChatWindow




