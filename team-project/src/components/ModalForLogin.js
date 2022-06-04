import React from "react"
import { Link } from "react-router-dom"
import { ProductConsumer } from './context'
import axios from 'axios'
import ModalComp from "react-modal"

let customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderColor: "#031227",
        borderWidth: "5px",
        borderRadius: "2rem",
        backgroundColor: "#5bc0de",
        height: '80%'
    }
}


class ModalForLogin extends React.Component {

    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            reqmsg: "",
        }
        this.changehandler = this.changehandler.bind(this);
        this.loginclickhandler = this.loginclickhandler.bind(this)
    }

    changehandler(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    loginclickhandler(modalclose, login) {
        if (this.state.username === "") { return this.setState({ reqmsg: "Username is required" }) }
        else if (this.state.password === "") { return this.setState({ reqmsg: "Password is required" }) }
        else { this.setState({ reqmsg: "LOADING" }) }
        axios.post('https://resolve4.herokuapp.com/auth/login', { username: this.state.username, password: this.state.password }, { withCredentials: true, headers: { "Content-Type": "application/json" } })
            .then((res) => {
                if (res.data.result === true) {
                    this.setState({
                        reqmsg: ""
                    })
                    modalclose();
                    login(res.data.user)
                    window.location.reload();
                }
                else {
                    console.log(res.data.reqmsg)
                    this.setState({
                        reqmsg: res.data.reqmsg
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
                    return (
                        < ModalComp
                            isOpen={object.modalstatus}
                            style={customStyles}
                            ariaHideApp={false} >
                            <div >
                                <div class="login-modal p-2">
                                    <div class="close-div" onClick={() => { this.setState({ reqmsg: "" }); object.modalclose() }}>
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times"
                                            class="close-icon svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 352 512">
                                            <path fill="currentColor"
                                                d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z">
                                            </path>
                                        </svg>
                                    </div>
                                    <h2 class="pb-4">Login</h2>
                                    <form class="px-sm-5">
                                        <div class="form-group">
                                            <input type="text" class="form-control" id="email" placeholder='Username' name='username' onChange={this.changehandler} />
                                        </div>
                                        <div class="form-group">
                                            <input type="password" class="form-control" id="password" placeholder="Password" placeholder='password' name='password' onChange={this.changehandler} />
                                        </div>
                                    </form>

                                    <button class="login-button btn mt-3 mb-2" onClick={() => { this.loginclickhandler(object.modalclose, object.login) }}>Login
                                         <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sign-in-alt" class="login-icon pl-2 svg-inline--fa fa-sign-in-alt fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path fill="currentColor" d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z"></path>
                                        </svg>
                                    </button>
                                    <hr />
                                    <div>Or <a href="https://resolve4.herokuapp.com/auth/google"><img src={require(`\../googleimg.png`)} class="google-login" alt="Login with Google" /></a></div>
                                    <Link to="/signup_form" exact="true" strict="true"><p class="signup mt-4" onClick={() => { object.modalclose() }}><strong>Don't have an account? Signup</strong></p></Link>
                                    {this.state.reqmsg === "" ? null :
                                        this.state.reqmsg === "LOADING" ? <div class="spinner-border" style={{ color: '#031227' }} role="status"><span class="sr-only">Loading...</span></div> : <div style={{ color: "#212529" }}><b>!!!{this.state.reqmsg.toUpperCase()}</b></div>}
                                </div>
                            </div>
                        </ModalComp>
                    )
                }}
            </ProductConsumer >
        )
    }
}
export default ModalForLogin
