import React from "react";
import { Link, Redirect } from "react-router-dom";
import { ProductConsumer } from "./context";
import ModalComp from "react-modal";
import axios from 'axios'
import socketIOClient from "socket.io-client";


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
    height: '80%',
    overflowY: 'hidden'
  }
}

class NonCloseableModalForLogin extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      reqmsg: "",
      redirect: false,
    };
    this.clickhandler = this.clickhandler.bind(this);
    this.changehandler = this.changehandler.bind(this);
  }

  clickhandler(login, savesocket) {
    if (this.state.username === "") { return this.setState({ reqmsg: "Username is required" }) }
    else if (this.state.password === "") { return this.setState({ reqmsg: "Password is required" }) }
    else { this.setState({ reqmsg: "LOADING" }) }
    axios.post('https://resolve4.herokuapp.com/auth/login', { username: this.state.username, password: this.state.password }, { withCredentials: true, headers: { "Content-Type": "application/json" } })
      .then((res) => {
        if (res.data.result === true) {
          this.setState({
            redirect: true,
            reqmsg: "",
          })
          login(res.data.user)
          const socket = socketIOClient("http://127.0.0.1:2000");
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
        console.log(err)
      })
  }

  changehandler(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <ProductConsumer>
        {object => {
          if (this.state.redirect === true) {
            return (
              <Redirect to='/ask_a_doubt' exact strict />
            )
          }
          return (
            <ModalComp isOpen={true} style={customStyles} ariaHideApp={false}>
              <div >
                <div class="login-modal p-2">
                  <div class="close-div" onClick={() => { this.setState({ reqmsg: "" }); object.modalclose() }}>
                    <Link to="/" exact="true" strict="true">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40px" height="40px"><path fill="#05386B" d="M7.9,256C7.9,119,119,7.9,256,7.9C393,7.9,504.1,119,504.1,256c0,137-111.1,248.1-248.1,248.1C119,504.1,7.9,393,7.9,256z" /><path fill="#fdfcfa" d="M408.1,206.8l-150.1-74.9c-1.3-0.6-2.7-0.6-4,0l-150.2,74.9c-1.7,0.8-2.7,2.4-2.7,4.3v29.6c0,1.6,0.8,3.1,2.2,4c1.4,0.9,3.1,1,4.5,0.3l148.2-74l148.1,74c0.6,0.3,1.3,0.5,2,0.5c0.9,0,1.8-0.2,2.5-0.7c1.4-0.9,2.2-2.4,2.2-4V211C410.8,209.2,409.8,207.5,408.1,206.8z" /><path fill="#fdfcfa" d="M380.5 245.8L256 183.8 131.5 245.8 131.5 360.8 200.5 360.8 200.5 272.6 248 272.6 248 360.8 380.5 360.8z" /><path fill="#fdfcfa" d="M263.7 272.6H295.7V304.6H263.7z" /></svg>
                    </Link>
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

                  <button class="login-button btn mt-3 mb-2" onClick={() => { this.clickhandler(object.login, object.savesocket) }}>Login
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sign-in-alt" class="login-icon pl-2 svg-inline--fa fa-sign-in-alt fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path fill="currentColor" d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z"></path>
                    </svg>
                  </button>
                  <hr />
                  <div>Or <a href="https://resolve4.herokuapp.com/auth/google_specific"><img src={require(`\../googleimg.png`)} class="google-login" alt="Login with Google" /></a></div>
                  <Link to="/signup_form" exact="true" strict="true"><p class="signup mt-4" onClick={() => { object.modalclose() }}><strong>Don't have an account? Signup</strong></p></Link>
                  {this.state.reqmsg === "" ? null :
                    this.state.reqmsg === "LOADING" ? <div class="spinner-border" style={{ color: '#031227' }} role="status"><span class="sr-only">Loading...</span></div> : <div style={{ color: "#212529" }}><b>!!!{this.state.reqmsg.toUpperCase()}</b></div>}
                </div>
              </div>
            </ModalComp>
          );
        }}
      </ProductConsumer>
    );
  }
}
export default NonCloseableModalForLogin;
