import React from "react"
import axios from 'axios'
import { Link } from 'react-router-dom'
import { ProductConsumer } from './context'

class PublicUserPage extends React.Component {

    constructor(props) {
        super();
        this.state = {
            init: true,
            userid: props.id,
            user: null,
            doubts: []
        }
    }

    componentDidMount() {
        this.setState({ init: true })
        axios.get(`https://resolve4.herokuapp.com/auth/getuserpublic/${this.state.userid}`, { withCredentials: true, headers: { "Content-Type": "application/json" } })
            .then((res) => {
                if (res.data.status === false) {
                    console.log(res.data.err)
                }
                else {
                    this.setState({ user: res.data.user })
                    axios.post('https://resolve4.herokuapp.com/doubt/specified', { ids: res.data.user.doubts }, { withCredentials: true, headers: { "Content-Type": "application/json" } })
                        .then((doubts) => {
                            let doubtscomp = doubts.data.doubts.map((doubt) => {
                                return (
                                    <Link id='myprofiledoubt' to={`/doubts/${doubt._id}`} exact={true} strict={true}><li style={{ color: '#293c6f', margin: '2%' }}>{doubt.title}</li></Link >
                                )
                            })
                            this.setState({ doubts: doubtscomp, init: false })
                        })
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render() {
        if (this.state.init === true) {
            return (
                <div className="spinner-grow text-info" role="status" style={{ marginLeft: "48%", marginTop: "18%", transform: "scale(3)" }}>
                    <span className="sr-only text-center mx-auto my-auto">Loading...</span>
                </div>
            )
        }
        else {
            if (this.state.user.private === true) {
                return (
                    <h1 style={{ color: '#5bc0de', marginTop: '5%' }} align='center'>This profile is not allowed for public view</h1>
                )
            }
            else {
                let skills = this.state.user.skills.split(',')
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
                return (
                    <ProductConsumer>
                        {object => {
                            return (
                                <React.Fragment>
                                    <br /><br />
                                    <div class="container">
                                        <div class="d-flex">
                                            {this.state.user.dp === "" ? <div class="dp text-center">{this.state.user.userName[0]}</div> :
                                                <div className="dp text-center mb-4" style={{ backgroundColor: "#031227", border: "1px solid #031227" }}><img style={{ height: "2em", width: "2em" }} src={"https://resolve4.herokuapp.com" + this.state.user.dp} /></div>}
                                            <div className="align-self-center ml-3">
                                                <h2 id='fullname'>{this.state.user.firstName.toUpperCase() + ' ' + this.state.user.lastName.toUpperCase()}</h2>
                                                <div id="username"><b>Username:</b>{this.state.user.userName}</div>
                                            </div>
                                            <div className="text-center ml-auto">
                                                {object.user === null ? <div className="btn btn-outline-info" id='fullname' onClick={object.modalopen}>Send Message</div>
                                                    :
                                                    <Link to={`/chat/${this.state.userid}/${this.state.user.userName}`} exact="true" strict="true">
                                                        <div className="btn btn-outline-info" id='fullname'>Send Message</div>
                                                    </Link>
                                                }
                                            </div>
                                        </div>
                                        <div id="email" style={{ color: '#5bc0de' }} class="mt-3 color-secondary">
                                            <span><b>Email:</b>{this.state.user.email}</span>
                                            <div class="row">
                                                <div class="col-sm-4 mt-5 pl-sm-5">
                                                    <h4 class="ml-4 ml-sm-0 ml-lg-5" style={{ color: '#5bc0de' }}>User Points: <span>{this.state.user.points}</span></h4>
                                                    <h4 class="mt-4 ml-4 ml-sm-0 ml-lg-5" style={{ color: '#5bc0de' }}>Interests:</h4>
                                                    <ul class=" color-secondary ml-4 ml-sm-0 ml-lg-5">
                                                        {this.state.skills === "" ? "Not Given" : skillscomp}
                                                    </ul>
                                                    <h4 class="mt-4 ml-4 ml-sm-0 ml-lg-5" style={{ color: '#5bc0de' }}>Academic Details</h4>
                                                    <div class=" color-secondary pl-3 ml-4 ml-sm-0 ml-lg-5">
                                                        <p><b>Roll Number:</b>{this.state.user.rollNumber === "" ? "Not Given" : this.state.user.rollNumber}</p>
                                                        <p><b>Branch:</b>{this.state.user.branch === "" ? "Not Given" : this.state.user.branch}</p>
                                                        <p><b>Year:</b>{this.state.user.year === "" ? "Not Given" : this.state.user.year}</p>
                                                    </div>
                                                </div>
                                                <div id="bookmark-doubt-section" class="col-sm-8 mt-5">
                                                    <h3 class="mt-5" style={{ color: '#5bc0de' }}>Doubts Posted <span class="color-secondary">({this.state.doubts.length})</span></h3>
                                                    <ul class="mt-3">
                                                        {this.state.doubts}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment >
                            )
                        }}
                    </ProductConsumer>
                )
            }
        }
    }
}
export default PublicUserPage
