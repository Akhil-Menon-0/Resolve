import React from "react"
import ModalComp from "react-modal"
import axios from 'axios'
import { Link } from 'react-router-dom'

const customStyles = {
    content: {
        top: '30%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderColor: "rgb(31,48,74)",
        borderWidth: "5px",
        borderRadius: "2rem",
        backgroundColor: "#5bc0de"
    }
};

class ModalUpdateEmail extends React.Component {

    constructor(props) {
        super()
        this.state = {
            email: props.user.email,
            status: "",
        }
        this.changehandler = this.changehandler.bind(this)
        this.submithandler = this.submithandler.bind(this)
    }

    changehandler(event) {
        this.setState({ email: event.target.value })
    }

    submithandler() {
        if ((this.state.email.includes('@') === false) || this.state.email === "") { return this.setState({ status: "Invalid email" }) }
        else { this.setState({ status: "loading" }) }
        axios.post('https://resolve4.herokuapp.com/auth/updateemail', { newemail: this.state.email }, { withCredentials: true, headers: { "Content-Type": 'application/json' } })
            .then((res) => {
                if (res.data.result === false) { this.setState({ status: res.data.msg }) }
                else { window.location.reload() }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render() {
        return (
            <ModalComp isOpen={this.props.open} style={customStyles} ariaHideApp={false}>
                <div class="container">
                    <div class="update-email-modal p-2">
                        <div class="d-flex justify-content-between">
                            <Link to='/' exact={true} strict={true}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40px" height="40px"><path fill="#05386B" d="M7.9,256C7.9,119,119,7.9,256,7.9C393,7.9,504.1,119,504.1,256c0,137-111.1,248.1-248.1,248.1C119,504.1,7.9,393,7.9,256z" /><path fill="#fdfcfa" d="M408.1,206.8l-150.1-74.9c-1.3-0.6-2.7-0.6-4,0l-150.2,74.9c-1.7,0.8-2.7,2.4-2.7,4.3v29.6c0,1.6,0.8,3.1,2.2,4c1.4,0.9,3.1,1,4.5,0.3l148.2-74l148.1,74c0.6,0.3,1.3,0.5,2,0.5c0.9,0,1.8-0.2,2.5-0.7c1.4-0.9,2.2-2.4,2.2-4V211C410.8,209.2,409.8,207.5,408.1,206.8z" /><path fill="#fdfcfa" d="M380.5 245.8L256 183.8 131.5 245.8 131.5 360.8 200.5 360.8 200.5 272.6 248 272.6 248 360.8 380.5 360.8z" /><path fill="#fdfcfa" d="M263.7 272.6H295.7V304.6H263.7z" /></svg></Link>
                            <svg onClick={this.props.closemodal} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="close-icon svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512">
                                <path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
                            </svg>
                        </div>
                        <h2 class="pb-4">Change Email Id</h2>
                        <h3>You Will Have To Verify Your New Email</h3>
                        <form class="px-sm-5">
                            <div class="form-group">
                                <input type="text" class="form-control" id="email" placeholder="New Email id" value={this.state.email} onChange={this.changehandler} />
                            </div>
                        </form>
                        <button class="login-button btn mt-3 mb-2 border" onClick={this.submithandler}>Submit</button>
                        <br />
                        {this.state.status === "" ? null : this.state.status === "loading" ? <div class="spinner-border" style={{ color: "#05386B" }} role="status"><span class="sr-only">Loading...</span></div> : <span style={{ color: '#212529' }}><strong>{this.state.status.toUpperCase()}</strong></span>}
                    </div>
                </div>
            </ModalComp>
        )
    }
}

export default ModalUpdateEmail