import React from "react"
import { Redirect } from "react-router-dom"
import { ProductConsumer } from "./context"
import axios from 'axios'
import socketIOClient from "socket.io-client";


class SignUp extends React.Component {

    constructor() {
        super();
        this.state = {
            username: "",
            fName: "",
            lName: "",
            email: "",
            password: "",
            re_enter_password: "",
            reqmsg: "",
            redirect: false
        }
        this.changehandler = this.changehandler.bind(this);
        this.clickhandler = this.clickhandler.bind(this);
    }

    changehandler(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    clickhandler(login, savesocket) {
        if (this.state.username === "") { return this.setState({ reqmsg: "Username is required" }) }
        else if (this.state.email === "") { return this.setState({ reqmsg: "Email is required" }) }
        else if (this.state.fName === "") { return this.setState({ reqmsg: "First Name is required" }) }
        else if (this.state.password === "") { return this.setState({ reqmsg: "Password is required" }) }
        else if (this.state.username.includes('#')) { return this.setState({ reqmsg: 'Username cannot include #' }) }
        else if (this.state.email.includes('@') === false) {
            { return this.setState({ email: "", reqmsg: "Enter a valid email" }) }
        }
        else if (this.state.password !== this.state.re_enter_password) {
            return this.setState({ reqmsg: "Re-entered password does not match", re_enter_password: "" })
        }
        else if (this.state.password.length < 8) { return this.setState({ reqmsg: "Minimum length of password must be 8", password: "", re_enter_password: "" }) }
        else {
            this.setState({ reqmsg: "LOADING" })
        }
        let object = {
            username: this.state.username,
            password: this.state.password,
            firstname: this.state.fName,
            lastname: this.state.lName,
            email: this.state.email
        }
        axios.post('https://resolve4.herokuapp.com/auth/signup', object, { withCredentials: true, headers: { "Content-Type": "application/json" } })
            .then((res) => {
                if (res.data.result === true) {
                    this.setState({
                        redirect: true,
                        reqmsg: "",
                    })
                    login(res.data.user)
                    const socket = socketIOClient("https://resolve4.herokuapp.com");
                    socket.emit('login', { user: res.data.user._id })
                    savesocket(socket)
                }
                else {
                    console.log(res.data.reqmsg)
                    this.setState({
                        redirect: false,
                        reqmsg: res.data.reqmsg,
                    })
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    render() {
        return (
            <ProductConsumer>
                {(object) => {
                    if (this.state.redirect === true) { return (<Redirect to='/profile_update' exact strict />) }
                    return (
                        <React.Fragment>
                            <br /><br />
                            <form className="signupform">
                                <div className='Maintext'><span style={{ color: "red" }}>*</span>Username</div>
                                <div class="Subtext">Choose a username by which you will be known</div>
                                <input className="Titletext" style={{ border: 'none', backgroundColor: "#293c6f", color: "#d8faff" }} type='text' value={this.state.username} placeholder="username" name="username" onChange={this.changehandler} />
                                <hr />
                                <div className="Maintext"><span style={{ color: "red" }}>*</span>FirstName</div>
                                <input className="Titletext" style={{ border: 'none', backgroundColor: "#293c6f", color: "#d8faff" }} type='text' value={this.state.fName} placeholder="First Name" name="fName" onChange={this.changehandler} />
                                <hr />
                                <div className="Maintext">LastName</div>
                                <input className="Titletext" style={{ border: 'none', backgroundColor: "#293c6f", color: "#d8faff" }} type='text' value={this.state.lName} placeholder="Last Name" name="lName" onChange={this.changehandler} />
                                <hr />
                                <div className='Maintext'><span style={{ color: "red" }}>*</span>Email id</div>
                                <div className="Subtext">Enter your email id on which to recieve mails</div>
                                <input className="Titletext" style={{ border: 'none', backgroundColor: "#293c6f", color: "#d8faff" }} type='email' value={this.state.email} placeholder="Email-id" name="email" onChange={this.changehandler} />
                                <hr />
                                <div className='Maintext'><span style={{ color: "red" }}>*</span>Password</div>
                                <input className="Titletext" style={{ border: 'none', backgroundColor: "#293c6f", color: "#d8faff" }} type='password' value={this.state.password} placeholder='Password' name="password" onChange={this.changehandler} />
                                <hr />
                                <div className="Maintext">Re-enter password</div>
                                <div className="Subtext">Re-enter the above password</div>
                                <input className="Titletext" style={{ border: 'none', backgroundColor: "#293c6f", color: "#d8faff" }} type='password' value={this.state.re_enter_password} placeholder='Re-enter password' name="re_enter_password" onChange={this.changehandler} />
                                <hr />
                                {this.state.reqmsg === "" ? null :
                                    this.state.reqmsg === "LOADING" ? <div class="spinner-border text-info" style={{ marginLeft: "35%" }} role="status"><span class="sr-only">Loading...</span></div> : <div style={{ color: "#d8faff", fontSize: "20pt" }}><b>!!!{this.state.reqmsg.toUpperCase()}</b></div>}
                                <div className="row">
                                    <div className='btn btn-info col-4' onClick={() => { this.clickhandler(object.login, object.savesocket) }}>Submit</div>
                                    <a className="col-4" href="https://resolve4.herokuapp.com/auth/google">
                                        <div onClick={() => { object.modalclose() }}>
                                            <svg width="30" height="30" viewBox="0 0 256 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4" /><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853" /><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05" /><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335" /></svg>
                                        </div>
                                    </a>
                                </div>
                            </form>
                        </React.Fragment>
                    )
                }}
            </ProductConsumer>
        )
    }
}
export default SignUp
