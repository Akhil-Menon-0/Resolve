import React from "react"
import { Link } from "react-router-dom"
import { ProductConsumer } from "./context"
import axios from 'axios'
import Modalupdateemail from './modalforupdateemail'
import Moment from 'react-moment';


class PrivateUserPage extends React.Component {

    constructor(props) {
        super(props)
        this.loginuser = null
        this.logoutuser = null
        this.activity = null
        this.state = {
            init: true,
            sendmailmsg: "",
            updateemailmodal: false,
            bookmarks: [],
            doubts: [],
            activity: []
        }
        this.sendmail = this.sendmail.bind(this)
        this.openmodal = this.openmodal.bind(this)
        this.closemodal = this.closemodal.bind(this)
    }

    openmodal() {
        this.setState({ updateemailmodal: true })
    }

    closemodal() {
        this.setState({ updateemailmodal: false })
    }

    sendmail() {
        this.setState({ sendmailmsg: "loading" })
        axios.get('https://resolve4.herokuapp.com/auth/sendmail', { withCredentials: true, headers: { "Content-Type": "application/json" } })
            .then((res) => {
                this.setState({ sendmailmsg: res.data.reqmsg })
            })

    }

    componentDidMount() {
        this.setState({ init: true })
        axios.get('https://resolve4.herokuapp.com/auth/getuser', { withCredentials: true, headers: { "Content-Type": "application/json" } })
            .then((res) => {
                if (res.data.result === false) { this.logoutuser() }
                else {
                    this.loginuser(res.data.user);
                    axios.post('https://resolve4.herokuapp.com/doubt/specified', { ids: res.data.user.bookmarks }, { withCredentials: true, headers: { "Content-Type": "application/json" } })
                        .then((bookmarks) => {
                            let bookmarkscomp = bookmarks.data.doubts.map((bookmark) => {
                                return (
                                    <Link id='myprofiledoubt' to={`/doubts/${bookmark._id}`} exact={true} strict={true}><li id='myprofiledoubt' style={{ color: '#293c6f', margin: '2%', width: '100%' }}>{bookmark.title}</li></Link>
                                )
                            })
                            this.setState({ bookmarks: bookmarkscomp })
                            axios.post('https://resolve4.herokuapp.com/doubt/specified', { ids: res.data.user.doubts }, { withCredentials: true, headers: { "Content-Type": "application/json" } })
                                .then((doubts) => {
                                    let doubtscomp = doubts.data.doubts.map((doubt) => {
                                        return (
                                            <Link id='myprofiledoubt' to={`/doubts/${doubt._id}`} exact={true} strict={true}><li style={{ color: '#293c6f', margin: '2%', width: '100%' }}>{doubt.title}</li></Link >
                                        )
                                    })
                                    this.setState({ doubts: doubtscomp })
                                    axios.get(`https://resolve4.herokuapp.com/auth/getseennotifications/${res.data.user._id}`, { withCredentials: true, headers: { "Content-Type": "application/json" } })
                                        .then((finalres) => {
                                            if (finalres.data.status === true) {
                                                this.activity = finalres.data.activity
                                                this.activity.sort(function (a, b) {
                                                    return new Date(b.date) - new Date(a.date)
                                                })
                                                let temp = this.activity.map((item) => {
                                                    if (res.data.user._id === item.owner && item.type === "doubt replied")
                                                        return null;
                                                    if (item.type === "reply created") {
                                                        return (
                                                            <li style={{ color: '#293c6f', margin: '2%', width: '100%' }}><Link to={`/doubts/${item.doubt}`} exact={true} strict={true}>
                                                                You posted reply to doubt <strong>{item.doubt_title}</strong> <span style={{ marginLeft: '5%', fontStyle: 'italic', color: 'gray' }}><br /><Moment fromNow>{item.date}</Moment></span>
                                                            </Link ></li>
                                                        )
                                                    }
                                                    else if (item.type === "doubt created") {
                                                        return (
                                                            <li style={{ color: '#293c6f', margin: '2%', width: '100%' }}><Link id='myprofiledoubt' to={`/doubts/${item.doubt}`} exact={true} strict={true}>
                                                                You posted a doubt <strong>{item.doubt_title}</strong> <span style={{ marginLeft: '5%', fontStyle: 'italic', color: 'gray' }}><br /><Moment fromNow>{item.date}</Moment></span>
                                                            </Link ></li>
                                                        )
                                                    }
                                                    else if (item.type === "upvoted") {
                                                        return (
                                                            <li style={{ color: '#293c6f', margin: '2%', width: '100%' }}>
                                                                <Link to={`/public_user_profile/${item.initiator}`} exact="true" strict="true">{item.initiator_username}</Link> <Link id='myprofiledoubt' to={`/doubts/${item.doubt}`} exact={true} strict={true}> upvoted your reply to doubt <strong>{item.doubt_title}</strong> <span style={{ marginLeft: '5%', fontStyle: 'italic', color: 'gray' }}><br /><Moment fromNow>{item.date}</Moment></span>
                                                                </Link ></li>
                                                        )
                                                    }
                                                    else if (item.type === "downvoted") {
                                                        return (
                                                            <li style={{ color: '#293c6f', margin: '2%', width: '100%' }}>
                                                                <Link to={`/public_user_profile/${item.initiator}`} exact="true" strict="true">{item.initiator_username}</Link> <Link id='myprofiledoubt' to={`/doubts/${item.doubt}`} exact={true} strict={true}>downvoted your reply to doubt <strong>{item.doubt_title}</strong> <span style={{ marginLeft: '5%', fontStyle: 'italic', color: 'gray' }}><br /><Moment fromNow>{item.date}</Moment></span>
                                                                </Link ></li>
                                                        )
                                                    }
                                                    else {
                                                        return (
                                                            <li style={{ color: '#293c6f', margin: '2%', width: '100%' }}>
                                                                <Link to={`/public_user_profile/${item.initiator}`} exact="true" strict="true">{item.initiator_username}</Link> <Link id='myprofiledoubt' to={`/doubts/${item.doubt}`} exact={true} strict={true}>replied to your doubt <strong>{item.doubt_title}</strong> <span style={{ marginLeft: '5%', fontStyle: 'italic', color: 'gray' }}><br /><Moment fromNow>{item.date}</Moment></span>
                                                                </Link ></li>
                                                        )
                                                    }
                                                })
                                                this.setState({ activity: temp })
                                            }
                                        })
                                })
                        })

                }
                this.setState({ init: false })
            })
            .catch((err) => { console.log(err); this.setState({ init: false }) })
    }

    render() {
        return (
            <ProductConsumer>
                {(object) => {
                    this.loginuser = object.login
                    this.logoutuser = object.logout
                    let skills = object.user.skills.split(',')
                    let skillscomp = skills.map((skill, index) => {
                        let color = ''
                        if (index % 5 === 0) { color = 'warning' }
                        else if (index % 5 === 1) { color = 'danger' }
                        else if (index % 5 === 2) { color = "success" }
                        else if (index % 5 === 3) { color = "dark" }
                        else if (index % 5 === 4) { color = 'primary' }
                        return (
                            <div style={{ margin: '2%' }}>
                                <li className={`btn btn-sm rounded-pill btn-${color}`} style={{ margin: "1px" }}>{skill}</li>
                            </div>
                        )
                    })
                    let removeunseen = 0
                    let unseen = object.notification
                    unseen = unseen.map((item) => {
                        if (item.initiator === item.owner && item.type === "doubt replied") {
                            removeunseen++
                            return null;
                        }

                        if (item.type === "reply created") {
                            return (
                                <li style={{ color: '#293c6f', margin: '2%', width: '100%' }}><Link id='myprofiledoubt' to={`/doubts/${item.doubt}`} exact={true} strict={true}>
                                    You posted reply to doubt <strong>{item.doubt_title}</strong> <span style={{ marginLeft: '5%', fontStyle: 'italic', color: 'gray' }}><br /><Moment fromNow>{item.date}</Moment></span>
                                </Link ></li>
                            )
                        }
                        else if (item.type === "doubt created") {
                            return (
                                <li style={{ color: '#293c6f', margin: '2%', width: '100%' }}><Link id='myprofiledoubt' to={`/doubts/${item.doubt}`} exact={true} strict={true}>
                                    You posted a doubt <strong>{item.doubt_title}</strong> <span style={{ marginLeft: '5%', fontStyle: 'italic', color: 'gray' }}><br /><Moment fromNow>{item.date}</Moment></span>
                                </Link ></li>
                            )
                        }
                        else if (item.type === "upvoted") {
                            return (
                                <li style={{ color: '#293c6f', margin: '2%', width: '100%' }}>
                                    <Link to={`/public_user_profile/${item.initiator}`} exact="true" strict="true">{item.initiator_username}</Link> <Link id='myprofiledoubt' to={`/doubts/${item.doubt}`} exact={true} strict={true}> upvoted your reply to doubt <strong>{item.doubt_title}</strong> <span style={{ marginLeft: '5%', fontStyle: 'italic', color: 'gray' }}><br /><Moment fromNow>{item.date}</Moment></span>
                                    </Link > </li>
                            )
                        }
                        else if (item.type === "downvoted") {
                            return (
                                <li style={{ color: '#293c6f', margin: '2%', width: '100%' }}>
                                    <Link to={`/public_user_profile/${item.initiator}`} exact="true" strict="true">{item.initiator_username}</Link> <Link id='myprofiledoubt' to={`/doubts/${item.doubt}`} exact={true} strict={true}>downvoted your reply to doubt <strong>{item.doubt_title}</strong> <span style={{ marginLeft: '5%', fontStyle: 'italic', color: 'gray' }}><br /><Moment fromNow>{item.date}</Moment></span>
                                    </Link ></li>
                            )
                        }
                        else {
                            return (
                                <li style={{ color: '#293c6f', margin: '2%', width: '100%' }}>
                                    <Link to={`/public_user_profile/${item.initiator}`} exact="true" strict="true">{item.initiator_username}</Link><Link id='myprofiledoubt' to={`/doubts/${item.doubt}`} exact={true} strict={true}> replied to your doubt <strong>{item.doubt_title}</strong> <span style={{ marginLeft: '5%', fontStyle: 'italic', color: 'gray' }}><br /><Moment fromNow>{item.date}</Moment></span>
                                    </Link ></li>
                            )
                        }
                    })
                    if (this.state.init === true) {
                        return (
                            <div className="spinner-grow text-info" role="status" style={{ marginLeft: "48%", marginTop: "18%", transform: "scale(3)" }}>
                                <span className="sr-only text-center mx-auto my-auto">Loading...</span>
                            </div>
                        )
                    }
                    else {
                        return (
                            <React.Fragment>
                                <br /><br />
                                <Modalupdateemail key={object.user.email} open={this.state.updateemailmodal} user={object.user} closemodal={this.closemodal} />
                                <div class="container">
                                    <div class="d-flex">
                                        {object.user.dp === "" ? <div class="dp text-center">{object.user.userName[0]}</div> :
                                            <div className="dp text-center mb-4" style={{ backgroundColor: "#031227", border: "1px solid #031227" }}><img style={{ height: "2em", width: "2em" }} src={"https://resolve4.herokuapp.com" + object.user.dp} /></div>}
                                        <div class="align-self-center ml-3">
                                            <h2 id='fullname'>{object.user.firstName.toUpperCase() + ' ' + object.user.lastName.toUpperCase()}</h2>
                                            <div id="username"><b>Username:</b>{object.user.userName}</div>
                                        </div>
                                    </div>
                                    <div id="email" style={{ color: '#5bc0de' }} class="mt-3 color-secondary">
                                        <span><b>Email:</b>{object.user.email}</span>
                                        {object.user.email_verified === true ?
                                            <span data-toggle="tooltip" data-placement="top" title="Email Verified" style={{ marginLeft: "1%" }}>
                                                <svg style={{ marginLeft: '1%' }} width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.6296 7.94908L16.4144 6.44143C16.2194 6.19108 16.0989 5.89082 16.0668 5.57509L15.853 3.66465C15.8097 3.2829 15.6383 2.9271 15.3667 2.65533C15.0951 2.38356 14.7394 2.21185 14.3577 2.16825L12.4462 1.95448C12.1086 1.92073 11.8161 1.77559 11.5686 1.58432L10.0632 0.37032C9.76323 0.13059 9.39067 0 9.00669 0C8.62271 0 8.25015 0.13059 7.95021 0.37032L6.44256 1.58544C6.19234 1.78088 5.89206 1.90177 5.57622 1.93423L3.66578 2.148C2.8782 2.23801 2.25939 2.85682 2.16938 3.64327L1.9556 5.55484C1.92185 5.89238 1.77671 6.18491 1.58544 6.43243L0.37032 7.93671C0.13059 8.23665 0 8.60921 0 8.99319C0 9.37716 0.13059 9.74972 0.37032 10.0497L1.58544 11.5573C1.77671 11.8048 1.90047 12.0974 1.93423 12.4237L2.148 14.3341C2.23801 15.1217 2.85682 15.7405 3.64327 15.8305L5.55484 16.0443C5.89238 16.078 6.18491 16.2232 6.43243 16.4144L7.93896 17.6296C8.55777 18.1235 9.43423 18.1235 10.0519 17.6296L11.5596 16.4144C11.8071 16.2232 12.0996 16.0994 12.4259 16.0657L14.3364 15.8519C15.1239 15.7619 15.7427 15.1431 15.8328 14.3566L16.0465 12.445C16.0803 12.1075 16.2254 11.815 16.4167 11.5674L17.6318 10.0609C17.8715 9.76098 18.0021 9.38842 18.0021 9.00444C18.0021 8.62046 17.8715 8.2479 17.6318 7.94796L17.6296 7.94908ZM7.31227 13.5116L3.37437 9.57375L5.06204 7.88608L7.31227 10.1363L12.9378 4.51074L14.6255 6.25466L7.31227 13.5116Z" fill="#009F00" />
                                                </svg></span> :
                                            <span data-toggle="tooltip" data-placement="top" title="Email Not Verified" style={{ marginLeft: "1%" }}>
                                                <svg style={{ marginLeft: '1%' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9 0C10.6328 0 12.1387 0.402344 13.5176 1.20703C14.8965 2.01172 15.9883 3.10352 16.793 4.48242C17.5977 5.86133 18 7.36719 18 9C18 10.6328 17.5977 12.1387 16.793 13.5176C15.9883 14.8965 14.8965 15.9883 13.5176 16.793C12.1387 17.5977 10.6328 18 9 18C7.36719 18 5.86133 17.5977 4.48242 16.793C3.10352 15.9883 2.01172 14.8965 1.20703 13.5176C0.402344 12.1387 0 10.6328 0 9C0 7.36719 0.402344 5.86133 1.20703 4.48242C2.01172 3.10352 3.10352 2.01172 4.48242 1.20703C5.86133 0.402344 7.36719 0 9 0ZM10.5 14.6133V12.3867C10.5 12.2773 10.4648 12.1855 10.3945 12.1113C10.3242 12.0371 10.2383 12 10.1367 12H7.88672C7.78516 12 7.69531 12.0391 7.61719 12.1172C7.53906 12.1953 7.5 12.2852 7.5 12.3867V14.6133C7.5 14.7148 7.53906 14.8047 7.61719 14.8828C7.69531 14.9609 7.78516 15 7.88672 15H10.1367C10.2383 15 10.3242 14.9629 10.3945 14.8887C10.4648 14.8145 10.5 14.7227 10.5 14.6133ZM10.4766 10.582L10.6875 3.30469C10.6875 3.21094 10.6484 3.14062 10.5703 3.09375C10.4922 3.03125 10.3984 3 10.2891 3H7.71094C7.60156 3 7.50781 3.03125 7.42969 3.09375C7.35156 3.14062 7.3125 3.21094 7.3125 3.30469L7.51172 10.582C7.51172 10.6602 7.55078 10.7285 7.62891 10.7871C7.70703 10.8457 7.80078 10.875 7.91016 10.875H10.0781C10.1875 10.875 10.2793 10.8457 10.3535 10.7871C10.4277 10.7285 10.4687 10.6602 10.4766 10.582Z" fill="#CF0000" />
                                                </svg> <span style={{ color: "blue", cursor: "pointer" }} onClick={this.sendmail}><u>Send Me Email</u></span></span>}
                                        {this.state.sendmailmsg === "" ? null :
                                            this.state.sendmailmsg === "loading" ? <div className="spinner-grow" role="status" >
                                                <span className="sr-only text-center mx-auto my-auto">Loading...</span>
                                            </div>
                                                : <span>&nbsp;&nbsp;{this.state.sendmailmsg}</span>
                                        }
                                        <span data-toggle="tooltip" data-placement="top" title="Edit Email" style={{ marginLeft: "1%" }}>
                                            <svg onClick={this.openmodal} style={{ marginLeft: '1%', cursor: 'pointer' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17.5042 4.99327L15.8834 6.61403C15.7182 6.77927 15.451 6.77927 15.2857 6.61403L11.3832 2.71153C11.218 2.54629 11.218 2.27909 11.3832 2.11385L13.004 0.493086C13.6614 -0.164362 14.7302 -0.164362 15.3912 0.493086L17.5042 2.60606C18.1651 3.26351 18.1651 4.3323 17.5042 4.99327ZM9.99097 3.5061L0.758572 12.7385L0.01323 17.0101C-0.0887272 17.5867 0.414027 18.086 0.990613 17.9875L5.26227 17.2387L14.4947 8.00628C14.6599 7.84103 14.6599 7.57384 14.4947 7.4086L10.5922 3.5061C10.4234 3.34086 10.1562 3.34086 9.99097 3.5061V3.5061ZM4.36223 11.9474C4.16886 11.7541 4.16886 11.4447 4.36223 11.2513L9.77651 5.83705C9.96988 5.64368 10.2793 5.64368 10.4726 5.83705C10.666 6.03042 10.666 6.3398 10.4726 6.53317L5.05835 11.9474C4.86499 12.1408 4.5556 12.1408 4.36223 11.9474V11.9474ZM3.09304 14.9042H4.78061V16.1804L2.51294 16.5777L1.41954 15.4843L1.81682 13.2166H3.09304V14.9042Z" fill="#86AAC3" />
                                            </svg>
                                        </span>
                                    </div>
                                    <Link to='/profile_update' exact='true' strict='true'>
                                        <div class="mt-2 color-secondary" style={{ color: '#5bc0de' }}>Update Profile
                                        <svg style={{ marginLeft: '1%' }} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17.5042 4.99327L15.8834 6.61403C15.7182 6.77927 15.451 6.77927 15.2857 6.61403L11.3832 2.71153C11.218 2.54629 11.218 2.27909 11.3832 2.11385L13.004 0.493086C13.6614 -0.164362 14.7302 -0.164362 15.3912 0.493086L17.5042 2.60606C18.1651 3.26351 18.1651 4.3323 17.5042 4.99327ZM9.99097 3.5061L0.758572 12.7385L0.01323 17.0101C-0.0887272 17.5867 0.414027 18.086 0.990613 17.9875L5.26227 17.2387L14.4947 8.00628C14.6599 7.84103 14.6599 7.57384 14.4947 7.4086L10.5922 3.5061C10.4234 3.34086 10.1562 3.34086 9.99097 3.5061V3.5061ZM4.36223 11.9474C4.16886 11.7541 4.16886 11.4447 4.36223 11.2513L9.77651 5.83705C9.96988 5.64368 10.2793 5.64368 10.4726 5.83705C10.666 6.03042 10.666 6.3398 10.4726 6.53317L5.05835 11.9474C4.86499 12.1408 4.5556 12.1408 4.36223 11.9474V11.9474ZM3.09304 14.9042H4.78061V16.1804L2.51294 16.5777L1.41954 15.4843L1.81682 13.2166H3.09304V14.9042Z" fill="#86AAC3" />
                                            </svg>
                                        </div>
                                    </Link>
                                    <div class="row">
                                        <div class="col-sm-4 mt-5 pl-sm-5">
                                            <h4 class="ml-4 ml-sm-0 ml-lg-5" style={{ color: '#5bc0de' }}>User Points: <span>{object.user.points}</span></h4>

                                            <h4 class="mt-4 ml-4 ml-sm-0 ml-lg-5" style={{ color: '#5bc0de' }}>Interests:</h4>
                                            <ul class=" color-secondary ml-4 ml-sm-0 ml-lg-5">
                                                {object.skills === "" ? "Not Given" : skillscomp}
                                            </ul>
                                            <h4 class="mt-4 ml-4 ml-sm-0 ml-lg-5" style={{ color: '#5bc0de' }}>Academic Details</h4>
                                            <div class=" color-secondary pl-3 ml-4 ml-sm-0 ml-lg-5">
                                                <p><b>Roll Number:</b>{object.user.rollNumber === "" ? "Not Given" : object.user.rollNumber}</p>
                                                <p><b>Branch:</b>{object.user.branch === "" ? "Not Given" : object.user.branch}</p>
                                                <p><b>Year:</b>{object.user.year === "" ? "Not Given" : object.user.year}</p>
                                            </div>
                                        </div>
                                        <div id="bookmark-doubt-section" class="col-sm-8 mt-5">
                                            <h3 style={{ color: '#5bc0de' }}>Bookmarked Doubts <span class="color-secondary">({this.state.bookmarks.length})</span></h3>
                                            <ul class="mt-3">
                                                {this.state.bookmarks}
                                            </ul>
                                            <h3 class="mt-5" style={{ color: '#5bc0de' }}>Your Doubts <span class="color-secondary">({this.state.doubts.length})</span></h3>
                                            <ul class="mt-3">
                                                {this.state.doubts}
                                            </ul>
                                            <h3 class="mt-5" style={{ color: '#5bc0de' }}>Account Activity <span class="color-secondary">({this.state.activity.length + unseen.length - removeunseen})</span></h3>
                                            <ul class='mt-3'>
                                                {unseen}
                                                <hr style={{ backgroundColor: "#5bc0de" }} />
                                                {this.state.activity}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        )
                    }
                }}
            </ProductConsumer >
        )
    }
}
export default PrivateUserPage
