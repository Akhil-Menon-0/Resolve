import React from "react"
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import Editor from "draft-js-plugins-editor";
import MultiDecorator from "draft-js-plugins-editor/lib/Editor/MultiDecorator";
import { CompositeDecorator } from "draft-js";
import addLinkPlugin from "./addLinkPlugin";
import axios from "axios";
import { ProductConsumer } from "./context"
import { Link } from 'react-router-dom'
import Moment from 'react-moment';

class ReplyCard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            doubt: this.props.doubt,
            reply: this.props.reply,
            canVote: this.props.user !== null ? this.props.reply.upvotedusers.indexOf(this.props.user._id) : -1
        }
        this.plugins = [addLinkPlugin]
    }
    clickUpvote = (user, socket) => {
        this.setState({
            canVote: 0
        })
        let upvotedata = {
            _id: this.state.reply._id,
            upvotes: this.state.reply.upvotes,
            upvotedusers: this.state.reply.upvotedusers,
            userid: user._id,
            writer: this.state.reply.user,
            username: user.userName,
            doubtid: this.state.doubt._id,
            doubttitle: this.state.doubt.title,
            replyuser: this.state.reply.user
        }


        axios.post("https://resolve4.herokuapp.com/reply/upvote", upvotedata, { withCredentials: true, headers: { "Content-Type": "application/json" } })
            .then((res) => {
                if (res.data.status === true) {
                    socket.emit('upvote', { notification: res.data.notification })
                    this.setState((prevState) => {
                        prevState.reply.upvotedusers.push(user._id)
                        prevState.reply.upvotes++
                        return (
                            {
                                reply: prevState.reply,
                            }
                        )
                    })
                }
                else { console.log(res.data.err) }
            })
            .catch((err) => {
                console.log(err);
            })



    }
    clickDownvote = (user, socket) => {
        this.setState({
            canVote: -1
        })
        let upvotedata = {
            _id: this.state.reply._id,
            upvotes: this.state.reply.upvotes,
            upvotedusers: this.state.reply.upvotedusers,
            userid: user._id,
            writer: this.state.reply.user,
            username: user.userName,
            doubtid: this.state.doubt._id,
            doubttitle: this.state.doubt.title,
            replyuser: this.state.reply.user
        }



        axios.post("https://resolve4.herokuapp.com/reply/downvote", upvotedata, { withCredentials: true, headers: { "Content-Type": "application/json" } })
            .then((res) => {
                if (res.data.status === true) {
                    socket.emit('downvote', { notification: res.data.notification })
                    this.setState((prevState) => {
                        let newarr = prevState.reply.upvotedusers.filter((item) => {
                            return !(item === user._id)
                        })
                        prevState.reply.upvotedusers = newarr
                        prevState.reply.upvotes--
                        return (
                            {
                                reply: prevState.reply,
                            }
                        )
                    })
                }
                else { console.log(res.data.err) }
            })
            .catch((err) => {
                console.log(err);
            })



    }
    getPluginDecoratorArray = () => {
        let decorators = [];
        let plugin;
        for (plugin of this.plugins) {
            if (plugin.decorators !== null && plugin.decorators !== undefined) {
                decorators = decorators.concat(plugin.decorators);
            }
        }
        return decorators;
    }
    myFunctionForGrabbingAllPluginDecorators = () => {
        return new MultiDecorator(
            [new CompositeDecorator(this.getPluginDecoratorArray())]
        );
    }

    render() {
        let des = JSON.parse(this.state.reply.content)
        const contentState = convertFromRaw(des);
        let decorator = this.myFunctionForGrabbingAllPluginDecorators();
        const editorState = EditorState.createWithContent(contentState, decorator);
        let username = this.state.reply.username

        return (
            <ProductConsumer>
                {(object) => {
                    return (
                        <React.Fragment>
                            <div className="d-flex mt-4">
                                <div className="text-center">
                                    {this.state.reply.dp === "" ? <div className="dp text-center mb-4">{username[0]}</div> :
                                        <div className="dp text-center mb-4" style={{ backgroundColor: "#031227", border: "1px solid #031227" }}><img style={{ height: "2em", width: "2em" }} src={"https://resolve4.herokuapp.com" + this.state.reply.dp} /></div>}

                                    {object.user !== null ?
                                        this.state.canVote === -1 ? <button style={{ backgroundColor: "#031227", border: "1px solid #031227", outline: "none" }} onClick={() => this.clickUpvote(object.user, object.socket)}><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-alt-circle-up"
                                            className="my-icon mb-1 svg-inline--fa fa-arrow-alt-circle-up fa-w-16" role="img"
                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path fill="currentColor"
                                                d="M8 256C8 119 119 8 256 8s248 111 248 248-111 248-248 248S8 393 8 256zm292 116V256h70.9c10.7 0 16.1-13 8.5-20.5L264.5 121.2c-4.7-4.7-12.2-4.7-16.9 0l-115 114.3c-7.6 7.6-2.2 20.5 8.5 20.5H212v116c0 6.6 5.4 12 12 12h64c6.6 0 12-5.4 12-12z">
                                            </path>
                                        </svg></button> : <button style={{ backgroundColor: "#031227", border: "1px solid #031227", outline: "none" }} onClick={() => this.clickDownvote(object.user, object.socket)}><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-alt-circle-down"
                                            className="my-icon svg-inline--fa fa-arrow-alt-circle-down fa-w-16" role="img"
                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path fill="currentColor"
                                                d="M504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zM212 140v116h-70.9c-10.7 0-16.1 13-8.5 20.5l114.9 114.3c4.7 4.7 12.2 4.7 16.9 0l114.9-114.3c7.6-7.6 2.2-20.5-8.5-20.5H300V140c0-6.6-5.4-12-12-12h-64c-6.6 0-12 5.4-12 12z">
                                            </path>
                                        </svg></button> :
                                        <span data-toggle="tooltip" data-placement="top" title="Login to continue" style={{ marginLeft: "1%" }}>
                                            <button disbaled={true} style={{ backgroundColor: "#031227", border: "1px solid #031227", outline: "none" }} >
                                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-alt-circle-up"
                                                    className="my-icon mb-1 svg-inline--fa fa-arrow-alt-circle-up fa-w-16" role="img"
                                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                    <path fill="currentColor" d="M8 256C8 119 119 8 256 8s248 111 248 248-111 248-248 248S8 393 8 256zm292 116V256h70.9c10.7 0 16.1-13 8.5-20.5L264.5 121.2c-4.7-4.7-12.2-4.7-16.9 0l-115 114.3c-7.6 7.6-2.2 20.5 8.5 20.5H212v116c0 6.6 5.4 12 12 12h64c6.6 0 12-5.4 12-12z"></path>
                                                </svg>
                                            </button>
                                        </span>
                                    }
                                    <span data-toggle='tooltip' data-placement='top' title='Votes'>
                                        <p className="secondary-color">{this.state.reply.upvotes}</p>
                                    </span>
                                </div>
                                <div className="ml-3 mt-2 flex-grow-1 ">
                                    <Link to={`/public_user_profile/${this.state.reply.user}`} exact="true" strict="true"><div className="by-line">{username}</div></Link>
                                    <div className="by-line"><Moment fromNow>{this.state.reply.date}</Moment></div>

                                    <div className="ViewDescription content-box p-3 my-3">
                                        <Editor readOnly={true} editorState={editorState} />
                                        {this.state.reply.code !== "" &&
                                            <p className="code p-2 pl-3 mt-3 mr-md-5">{this.state.reply.code}</p>}
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    )
                }}
            </ProductConsumer>
        )
    }
}


export default ReplyCard


