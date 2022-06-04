import React from "react"
import { ProductConsumer } from "./context"
import { convertToRaw } from 'draft-js'
import InputDesc from "./doubtform_inputdesc"
import axios from "axios"
class PostReply extends React.Component {
    constructor() {
        super()
        this.state = {
            newreply: null,
            code: "",
            newreplyfilled: false,
            errmsg: "",
            shortreply: false
        }
        this.clickhandler = this.clickhandler.bind(this)
        this.changehandler = this.changehandler.bind(this)
    }
    assignReply = (obj) => {
        if (obj.getPlainText().length < 30 && obj.getPlainText().length !== 0) { return this.setState({ shortreply: true, newreplyfilled: obj.hasText(), newreply: convertToRaw(obj) }) }
        else { this.setState({ errmsg: "", shortreply: false }) }
        this.setState({ newreply: convertToRaw(obj), newreplyfilled: obj.hasText() });
    }
    changehandler(event) {
        event.preventDefault()
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }
    clickhandler(user, addnotification, socket) {
        if (this.state.newreplyfilled === false) { return this.setState({ errmsg: "Description is required" }) }
        else if (this.state.shortreply === true) { return this.setState({ errmsg: "Description must be at least 30 characters long" }) }
        else { this.setState({ errmsg: "loading", newreplyfilled: true, shortreply: false }) }
        let replydata = {
            code: this.state.code,
            content: JSON.stringify(this.state.newreply),
            doubtid: this.props.doubtid,
            username: user.userName,
            userid: user._id,
            repliesarr: this.props.repliesarr,
            user_replies: user.replies,
            dpimage: user.dp,
            doubt: this.props.doubt
        }
        axios.post("https://resolve4.herokuapp.com/reply/upload_reply", replydata, { withCredentials: true, headers: { "Content-Type": "application/json" } })
            .then((res) => {
                if (res.data.status === true) {
                    addnotification(res.data.notification)
                    socket.emit('replied', { owner: this.props.doubt.user, doubtid: this.props.doubt._id, title: this.props.doubt.title.substring(0, 9) + '...', initiator: user._id, initiator_username: user.userName })
                    window.location.reload();
                }
                else { console.log(res.data.err) }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    render() {
        return (
            <ProductConsumer>
                {(object) => {
                    let username = ""
                    if (object.user !== null) {
                        username = object.user.userName
                        if (username.indexOf('#') !== -1) {
                            username = username.slice(0, username.length - 1);
                        }
                    }

                    return (
                        <React.Fragment>
                            <div id="post-section" className="mb-4">
                                <div className="d-flex mt-4">
                                    {object.user !== null &&
                                        <React.Fragment>
                                            <div className="text-center">
                                                {object.user.dp === "" ? <div className="dp text-center mb-4">{username[0]}</div> :
                                                    <div className="dp text-center mb-4" style={{ backgroundColor: "#031227", border: "1px solid #031227" }}><img style={{ height: "2em", width: "2em" }} src={"https://resolve4.herokuapp.com" + object.user.dp} /></div>}
                                            </div></React.Fragment>}
                                    <div className="ml-3 mt-2 flex-grow-1 ">
                                        <div className="by-line">{username}</div>

                                        <div className="Reply content-box my-3">
                                            <form style={{ padding: "10px" }} >
                                                <div className="Maintext">Code</div>
                                                <div className="Subtext">Insert code here (Optional).</div>
                                                <textarea className="Codetext " style={{ backgroundColor: "rgb(31,48,74)", color: "#fdfcfa" }} placeholder='Code' name='code' onChange={this.changehandler} />
                                                <hr style={{ borderTop: "1px solid #86aac4" }} />
                                                <div className="Maintext"><span style={{ color: "red" }}>*</span>Description</div>
                                                <div className="Subtext">Write the description of your answer</div>
                                                <InputDesc assignDesc={this.assignReply} placeholder="Post an answer" imageAllowed={false} />
                                            </form>
                                            <div class="px-3 py-2">
                                                <button className='btn btn-outline-primary' disabled={object.isLogged === true ? false : true} onClick={() => { this.clickhandler(object.user, object.addnotification, object.socket) }} >{object.isLogged === true ? "Submit" : "Log in to continue"}</button>
                                            </div>
                                            {this.state.errmsg === "" ? null : this.state.errmsg === 'loading' ? <div class="spinner-border text-info" style={{ marginLeft: "5%" }} role="status"><span class="sr-only">Loading...</span></div> : <div style={{ color: '#5bc0de;' }}><strong>{this.state.errmsg.toUpperCase()}</strong></div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    )
                }
                }
            </ProductConsumer>
        )
    }
}
export default PostReply
