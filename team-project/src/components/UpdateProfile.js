import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import FormData from 'form-data'

class UpdateProfile extends React.Component {
    constructor(props) {
        super()
        this.state = {
            year: props.user.year,
            rollNumber: props.user.rollNumber,
            branch: props.user.branch,
            skills: props.user.skills,
            private: props.user.private,
            dp: null,
            dpname: props.user.dp,
            Loading: false
        }
        this.imagehandler = this.imagehandler.bind(this)
        this.removeimage = this.removeimage.bind(this)
        this.changehandler = this.changehandler.bind(this)
        this.clickhandler = this.clickhandler.bind(this)
    }

    imagehandler(e) {
        if (e.target.files[0] === null) { return }
        this.setState({
            dp: e.target.files[0],
            dpname: e.target.files[0].name
        })
        e.target.value = null
    }

    removeimage() {
        this.setState({ dp: null, dpname: "" })
    }

    changehandler(event) {
        const { name, value, type, checked } = event.target;
        if (type === 'checkbox') {
            this.setState({ private: !checked })
        }
        else {
            this.setState({ [name]: value });
        }
    }

    clickhandler(user) {
        this.setState({ Loading: true })
        const updates = new FormData()
        updates.append('_id', user._id)
        updates.append('year', this.state.year)
        updates.append('rollNumber', this.state.rollNumber)
        updates.append('branch', this.state.branch)
        updates.append('skills', this.state.skills)
        updates.append('private', this.state.private)
        updates.append('dp', this.state.dp)
        updates.append('dpname', this.state.dpname)
        axios.post('https://resolve4.herokuapp.com/auth/update_profile', updates, { withCredentials: true, headers: { "Content-Type": 'multipart/form-data' } })
            .then((res) => {
                if (res.data.status === true) {
                    this.setState({ loading: false })
                    window.location.assign("https://resolve4.herokuapp.com/private_user_profile")
                }
                else {
                    console.log(res.data.err)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render(props) {
        return (
            <React.Fragment>
                <br /><br />
                <div style={{ margin: "auto" }} className='mainform'>
                    <form>
                        <div className="Maintext">Year</div>
                        <input className="Titletext" type='text' value={this.state.year} style={{ border: 'none', backgroundColor: "#293c6f", color: "#d8faff" }} name='year' placeholder="Year" onChange={this.changehandler} />
                        <hr style={{ backgroundColor: '#5bc0de' }} />
                        <div className="Maintext">Roll Number</div>
                        <input className="Titletext" type='text' value={this.state.rollNumber} style={{ border: 'none', backgroundColor: "#293c6f", color: "#d8faff" }} name='rollNumber' placeholder="RollNumber" onChange={this.changehandler} />
                        <hr style={{ backgroundColor: '#5bc0de' }} />
                        <div className='Maintext'>Branch</div>
                        <input className="Titletext" type='text' value={this.state.branch} style={{ border: 'none', backgroundColor: "#293c6f", color: "#d8faff" }} name='branch' placeholder="Branch" onChange={this.changehandler} />
                        <hr style={{ backgroundColor: '#5bc0de' }} />
                        <div className='Maintext'>Skills</div>
                        <div className='Subtext'>Seprate them by ,</div>
                        <input className="Titletext" type='text' value={this.state.skills} style={{ border: 'none', backgroundColor: "#293c6f", color: "#d8faff" }} name='skills' placeholder="skills separated by ," onChange={this.changehandler} />
                        <hr style={{ backgroundColor: '#5bc0de' }} />
                        <input type='checkbox' style={{ margin: "2%" }} name='private' defaultChecked={!this.state.private} onClick={this.changehandler} /><span style={{ color: '#5bc0de' }}><strong>I ALLOW  TO VIEW MY PROFILE PUBLICALLY</strong></span>
                        <hr style={{ backgroundColor: '#5bc0de' }} />
                        <span data-toggle="tooltip" data-placement="top" title='Profile Picture' style={{ marginLeft: "1%" }}>
                            <label style={{ cursor: 'pointer' }}>
                                <svg height="27px" viewBox="0 0 384 384" width="30px" xmlns="http://www.w3.org/2000/svg"><path d="m336 0h-288c-26.472656 0-48 21.527344-48 48v288c0 26.472656 21.527344 48 48 48h288c26.472656 0 48-21.527344 48-48v-288c0-26.472656-21.527344-48-48-48zm-288 32h288c8.824219 0 16 7.175781 16 16v113.375l-52.6875-52.6875c-6.25-6.246094-16.375-6.246094-22.625 0l-112.6875 112.6875-40.6875-40.6875c-6.25-6.246094-16.375-6.246094-22.625 0l-68.6875 68.6875v-201.375c0-8.824219 7.175781-16 16-16zm288 320h-288c-8.824219 0-16-7.175781-16-16v-41.375l80-80 92.6875 92.679688c3.128906 3.136718 7.214844 4.695312 11.3125 4.695312s8.183594-1.558594 11.3125-4.6875c6.246094-6.25 6.246094-16.375 0-22.625l-40.6875-40.6875 101.375-101.367188 64 64v129.367188c0 8.824219-7.175781 16-16 16zm0 0" /><path d="m128 96c0 17.671875-14.328125 32-32 32s-32-14.328125-32-32 14.328125-32 32-32 32 14.328125 32 32zm0 0" /></svg>
                                <input id="Image" type='file' accept='image/*' onChange={this.imagehandler} hidden />
                            </label>
                        </span>
                        {this.state.dpname === "" ? null :
                            <span style={{ color: "#5bc0de" }}>
                                <br />
                                <i>{this.state.dpname.split('/').slice(-1)[0]}</i>
                                <svg cursor="pointer" onClick={this.removeimage} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="15px" height="15px"><path fill="#5bc0de" d="M8 9.704L4.057 13.646 2.354 11.943 6.296 8 2.354 4.057 4.057 2.354 8 6.296 11.943 2.354 13.646 4.057 9.704 8 13.646 11.943 11.943 13.646z" /><path fill="rgb(31,48,74)" d="M11.943,2.707l1.35,1.35L9.704,7.646L9.35,8l0.354,0.354l3.589,3.589l-1.35,1.35L8.354,9.704L8,9.35 L7.646,9.704l-3.589,3.589l-1.35-1.35l3.589-3.589L6.65,8L6.296,7.646L2.707,4.057l1.35-1.35l3.589,3.589L8,6.65l0.354-0.354 L11.943,2.707 M11.943,2L8,5.943L4.057,2L2,4.057L5.943,8L2,11.943L4.057,14L8,10.057L11.943,14L14,11.943L10.057,8L14,4.057 L11.943,2L11.943,2z" /></svg></span>
                        }
                        <hr style={{ backgroundColor: '#5bc0de' }} />
                    </form>
                    <button className='btn' id='buthover' onClick={() => { this.clickhandler(this.props.user) }}>SUBMIT</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a href='https://resolve4.herokuapp.com/private_user_profile'>My profile</a>
                    {this.state.Loading === false ? null :
                        <div class="spinner-border text-info" style={{ marginLeft: "5%" }} role="status"><span class="sr-only">Loading...</span></div>}
                </div>
            </React.Fragment >
        )
    }
}

export default UpdateProfile