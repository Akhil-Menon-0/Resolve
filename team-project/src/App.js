import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import Invalid_Page from "./components/Invalid_Page";
import TopDoubts from "./components/Top_doubts";
import TopUsers from "./components/TopUsers";
import Navbar from "./components/Navbar";
import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import SignUp from "./components/SignUpForm";
import AskDoubt from "./components/DoubtForm";
import FullDoubtWithAnswers from "./components/FullDoubtWithAnswers";
import ProblemPage from "./components/problem_page"
import PrivateUserPage from "./components/PrivateUserPage";
import { ProductConsumer } from "./components/context";
import PublicUserPage from "./components/PublicUserPage";
import AllDoubts from './components/All_doubts'
import ProfileUpdate from './components/UpdateProfile'
import axios from 'axios'
import Footer from './components/Footer'
import ChatWindow from './components/ChatWindow'
import EmailVerification from './components/email_verification_msg'
import socketIOClient from "socket.io-client";

class App extends React.Component {

  constructor() {
    super()
    this.loginuser = null
    this.logoutuser = null
    this.socket = null
    this.addnotification = null
    this.addmessage = null

    this.state = {
      init: true,
      endpoint: "https://resolve4.herokuapp.com"
    }
  }


  componentDidMount() {
    this.setState({ init: true })
    axios.get('https://resolve4.herokuapp.com/auth/getuser', { withCredentials: true, headers: { "Content-Type": "application/json" } })
      .then((res) => {
        if (res.data.result === false) {
          this.logoutuser();
          console.log('here')
        }
        else {
          this.loginuser(res.data.user);
          const socket = socketIOClient(this.state.endpoint);
          socket.emit('login', { user: res.data.user._id })
          this.savesocket(socket)
          socket.on('initial_notify', (data) => {
            for (let i of data) { this.addnotification(i) }
          })
          socket.on('notify', (data) => {
            let audio = new Audio('http://newt.phys.unsw.edu.au/music/bellplates/sounds/equilateral_plate_no_second_partial.mp3')
            audio.play()
            this.addnotification(data)
          })
          socket.on('message', (data) => {
            let audio = new Audio('http://newt.phys.unsw.edu.au/music/bellplates/sounds/equilateral_plate_no_second_partial.mp3')
            audio.play()
            this.addmessage(data)
          })
        }
        this.setState({ init: false })
      })
      .catch((err) => { console.log(err); this.setState({ init: false }) })
  }

  render() {
    return (
      <ProductConsumer>
        {object => {
          this.loginuser = object.login
          this.logoutuser = object.logout
          this.savesocket = object.savesocket
          this.socket = object.socket
          this.addnotification = object.addnotification
          this.addmessage = object.addmessage
          if (this.state.init === true) {
            return (
              <div className="spinner-grow text-info" role="status" style={{ marginLeft: "48%", marginTop: "18%", transform: "scale(3)" }}>
                <span className="sr-only text-center mx-auto my-auto">Loading...</span>
              </div>
            )
          }
          else {
            return (
              <div style={{ position: "relative", minHeight: "100vh" }}>
                <div style={{ paddingBottom: "15rem" }}>
                  <Navbar />

                  <Switch>
                    <Route path="/" exact={true} strict={true} render={() => {
                      return <Home />;
                    }} />

                    <Route path="/all_doubts" exact={true} strict={true} render={() => {
                      return (<AllDoubts />)
                    }} />

                    <Route path="/top_doubts" exact={true} strict={true} render={() => {
                      return <TopDoubts />;
                    }} />

                    <Route path="/top_users" exac={true} t strict={true} render={() => {
                      return <TopUsers />;
                    }} />

                    <Route path="/signup_form" exact={true} strict={true} render={() => {
                      if (object.isLogged === true) {
                        return <Home />;
                      } else {
                        return <SignUp />;
                      }
                    }} />

                    <Route path="/ask_a_doubt" exact={true} strict={true} render={() => {
                      return <AskDoubt />;
                    }} />

                    <Route path="/public_user_profile/:id" exact={true} strict={true} render={(url) => {
                      return <PublicUserPage id={url.match.params.id} />;
                    }} />

                    <Route path='/profile_update' exact={true} strict={true} render={() => {
                      if (object.user === null) { return <Invalid_Page /> }
                      else { return <ProfileUpdate user={object.user} /> }
                    }} />

                    <Route path="/private_user_profile" exact={true} strict={true} render={() => {
                      if (object.user === null) {
                        return <Invalid_Page />;
                      } else {
                        return <PrivateUserPage />;
                      }
                    }} />

                    <Route path="/doubts/:id" exact={true} strict={true} render={(url) => {
                      return <FullDoubtWithAnswers id={url.match.params.id} user={object.user} />;
                    }} />

                    <Route path="/email_verification/:done" exact={true} strict={true} render={(url) => {
                      console.log(url.match.params.done)
                      return <EmailVerification done={url.match.params.done} />;
                    }} />

                    <Route path="/chat/:id/:name" exact={true} strict={true} render={(url) => {
                      if (object.user === null) {
                        return <Invalid_Page />
                      }
                      else {
                        return <ChatWindow person2={url.match.params.id} person2name={url.match.params.name} />
                      }
                    }} />


                    <Route path="/problem_page_for_all_so_that_no_one_can_guess_this_path_@ksbdb" exact={true} strict={true} render={() => {
                      return <ProblemPage />
                    }} />

                    <Route render={() => {
                      return <Invalid_Page />;
                    }}
                    />
                  </Switch>
                </div>
                <Footer />
              </div>
            );
          }
        }}
      </ProductConsumer>
    );
  }
}

export default App;
