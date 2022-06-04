import React from "react"
import { Link } from "react-router-dom"
import { ProductConsumer } from './context'
import ModalForLogin from './ModalForLogin'
import NotificationItem from "./NotificationItem"
import axios from 'axios'
import Messageitem from "./Messageitem"

class Navbar extends React.Component {

    constructor() {
        super();
        this.state = {
            dropdownshow: false,
            msgdropdown: false
        }
        this.logouthandler = this.logouthandler.bind(this)
        this.loginhandler = this.loginhandler.bind(this)
        this.changedropdown = this.changedropdown.bind(this)
        this.changemsgdropdown = this.changemsgdropdown.bind(this)
    }

    changemsgdropdown() {
        this.setState((prevstate) => {
            return { msgdropdown: !prevstate.msgdropdown }
        })
    }

    changedropdown() {
        this.setState((prevstate) => {
            return { dropdownshow: !prevstate.dropdownshow }
        })
    }

    loginhandler(modalopen) {
        modalopen();
    }

    logouthandler(logout, socket, deletesocket, user) {
        axios.get('https://resolve4.herokuapp.com/auth/logout', { withCredentials: true, headers: { "Content-Type": "application/json" } })
            .then((res) => {
                logout()
                socket.emit('customdisconnect', { user: user._id })
                deletesocket()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render() {
        return (
            <ProductConsumer>
                {(object) => {
                    let notif = null
                    let removeunseen = 0
                    if (object.isLogged === true) {
                        notif = object.notification.map((item) => {
                            if (item.initiator === item.owner && item.type === "doubt replied") {
                                removeunseen++
                            }
                            else {
                                return <NotificationItem item={item} remove={object.removenotification} />
                            }
                        })
                    }
                    let msgs = null
                    if (object.isLogged === true) {
                        msgs = object.messages.map((item, index) => {
                            if (item.sender === object.user._id) { return null }
                            else { return <Messageitem item={item} id={index} /> }
                        })
                        msgs.reverse();
                    }
                    return (
                        <React.Fragment>
                            <ModalForLogin redirect={false} />
                            <nav className="navbar navbar-expand-lg navbar-light " id="MainNav">
                                <Link to='/' exact="true" strict="true" id="Logo">
                                    <svg id='svghover' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40px" height="40px"><path fill="#05386B" d="M7.9,256C7.9,119,119,7.9,256,7.9C393,7.9,504.1,119,504.1,256c0,137-111.1,248.1-248.1,248.1C119,504.1,7.9,393,7.9,256z" /><path id='logohover' fill="#fdfcfa" d="M408.1,206.8l-150.1-74.9c-1.3-0.6-2.7-0.6-4,0l-150.2,74.9c-1.7,0.8-2.7,2.4-2.7,4.3v29.6c0,1.6,0.8,3.1,2.2,4c1.4,0.9,3.1,1,4.5,0.3l148.2-74l148.1,74c0.6,0.3,1.3,0.5,2,0.5c0.9,0,1.8-0.2,2.5-0.7c1.4-0.9,2.2-2.4,2.2-4V211C410.8,209.2,409.8,207.5,408.1,206.8z" /><path id='logohover' fill="#fdfcfa" d="M380.5 245.8L256 183.8 131.5 245.8 131.5 360.8 200.5 360.8 200.5 272.6 248 272.6 248 360.8 380.5 360.8z" /><path id='logohover' fill="#fdfcfa" d="M263.7 272.6H295.7V304.6H263.7z" /></svg>
                                </Link>
                                <button className="navbar-toggler" style={{ color: '#05386B' }} type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse justify-content-between" id="navbarNavAltMarkup">
                                    <div className="navbar-nav">
                                        <Link to="/ask_a_doubt" exact="true" strict="true" className="btn but but1" id='buthover' >Ask a Doubt</Link>

                                        <Link to='/all_doubts' exact="true" strict="true" className='btn but but1' id='buthover' >View Doubts</Link>
                                    </div>
                                    <div className="navbar-nav ">
                                        {object.isLogged === false &&
                                            <React.Fragment>
                                                <Link to="/signup_form" className="btn but but2" id='buthover' exact="true" strict="true" >Signup</Link>
                                                <div className="btn but but5" id='buthover' onClick={() => { this.loginhandler(object.modalopen) }}>Login</div>
                                            </React.Fragment>
                                        }
                                        {object.isLogged === true &&
                                            <React.Fragment>
                                                <div className='nav-item dropdown but but2'>
                                                    <a onClick={() => { this.changemsgdropdown() }} className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button" aria-haspopup="true" aria-expanded="true">
                                                        <svg height="25" viewBox="-21 -47 682.66669 682" width="25" xmlns="http://www.w3.org/2000/svg"><path d="m552.011719-1.332031h-464.023438c-48.515625 0-87.988281 39.464843-87.988281 87.988281v283.972656c0 48.414063 39.300781 87.816406 87.675781 87.988282v128.863281l185.191407-128.863281h279.144531c48.515625 0 87.988281-39.472657 87.988281-87.988282v-283.972656c0-48.523438-39.472656-87.988281-87.988281-87.988281zm50.488281 371.960937c0 27.835938-22.648438 50.488282-50.488281 50.488282h-290.910157l-135.925781 94.585937v-94.585937h-37.1875c-27.839843 0-50.488281-22.652344-50.488281-50.488282v-283.972656c0-27.84375 22.648438-50.488281 50.488281-50.488281h464.023438c27.839843 0 50.488281 22.644531 50.488281 50.488281zm0 0" /><path d="m171.292969 131.171875h297.414062v37.5h-297.414062zm0 0" /><path d="m171.292969 211.171875h297.414062v37.5h-297.414062zm0 0" /><path d="m171.292969 291.171875h297.414062v37.5h-297.414062zm0 0" /></svg>
                                                        {this.state.msgdropdown === true ?
                                                            <div className="dropdown-menu- dropdown-outer-" aria-labelledby="navbarDropdownMenuLink" style={{ backgroundColor: "#05386B", color: "white", borderRadius: "20px", position: "absolute", width: "250px", zIndex: "10" }}>
                                                                {msgs}
                                                            </div>
                                                            :
                                                            null
                                                        }
                                                    </a>

                                                </div>
                                                <Link to="/private_user_profile" className='btn but but2' id='buthover' exact="true" strict="true">My Profile</Link>
                                                <Link to='/' className='btn but but3' id='buthover' onClick={() => { this.logouthandler(object.logout, object.socket, object.deletesocket, object.user) }} exact="true" strict="true">LogOut</Link>
                                                <div className="nav-item dropdown but but4" >
                                                    <a onClick={() => { this.changedropdown() }} className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button" aria-haspopup="true" aria-expanded="true">
                                                        <svg id="Capa_1" enableBackground="new 0 0 511.156 511.156" height="25" viewBox="0 0 511.156 511.156" width="25" xmlns="http://www.w3.org/2000/svg"><path d="m184.904 465.044c11.999 27.127 39.154 46.112 70.674 46.112s58.674-18.985 70.674-46.112z" /><path d="m255.573 48.836c20.8 0 40.772 3.67 59.306 10.389v-2.283c0-31.398-25.544-56.942-56.941-56.942h-4.719c-31.398 0-56.942 25.544-56.942 56.942v2.254c18.524-6.699 38.49-10.36 59.296-10.36z" /><path d="m442.747 435.044h-374.338c-7.082 0-13.569-4.776-15.042-11.704-1.458-6.859 1.668-13.629 8.01-16.559 1.505-.976 12.833-8.897 24.174-32.862 20.829-44.01 25.201-106.005 25.201-150.263 0-79.855 64.967-144.82 144.821-144.82 79.665 0 144.512 64.652 144.82 144.245.007.191.011.383.011.575 0 44.258 4.372 106.253 25.201 150.263 11.341 23.965 22.668 31.887 24.174 32.862 6.342 2.93 9.469 9.699 8.01 16.559-1.473 6.927-7.959 11.704-15.042 11.704zm7.2-28.157h.01z" /></svg>
                                                        <span className="badge badge-dark">{notif.length - removeunseen}</span></a>
                                                    {this.state.dropdownshow === true ?
                                                        <div className="dropdown-menu- dropdown-outer-" aria-labelledby="navbarDropdownMenuLink" style={{ backgroundColor: "#05386B", color: "white", borderRadius: "20px", position: "absolute", width: "250px", zIndex: "10" }}>
                                                            {notif}
                                                        </div>
                                                        :
                                                        null
                                                    }
                                                </div>
                                            </React.Fragment>
                                        }
                                    </div>
                                </div>
                            </nav>
                        </React.Fragment>
                    )
                }
                }
            </ProductConsumer >
        )
    }
}
export default Navbar