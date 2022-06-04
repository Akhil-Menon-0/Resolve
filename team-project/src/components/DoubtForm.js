import React from "react"
import InputTags from "./doubtform_inputtags"
import { convertToRaw } from "draft-js"
import { ProductConsumer } from "./context"
import NonCloseableModalForLogin from './noncloseablemodalforlogin'
import NonCLoseableModalForUnverified from './noncloseablemodalforunverifiedemail'
import InputDesc from "./doubtform_inputdesc"
import axios from 'axios'
import FormData from 'form-data'
import { Redirect } from "react-router-dom"


class AskDoubt extends React.Component {
    constructor() {
        super();
        this.state = {
            title: "",
            desc: null,
            tags: [],
            image: undefined,
            code: "",
            redirect: "nodoubt",
            errmsg: "",
            descfilled: false,
            shortdesc: true,
            imageName: "",
            tagserrmsg: ""
        }
        this.imagehandler = this.imagehandler.bind(this)
        this.changehandler = this.changehandler.bind(this);
        this.clickhandler = this.clickhandler.bind(this);
        this.addTag = this.addTag.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.removeimage = this.removeimage.bind(this);
    }

    imagehandler(event) {
        if (event.target.files[0] === null) { return }
        this.setState({
            image: event.target.files[0],
            imageName: event.target.files[0].name
        })
        event.target.value = null
    }

    removeimage() {
        this.setState({ image: undefined, imageName: "" })
    }

    addTag(event) {
        if (event.key === "Enter" && event.target.value !== "") {
            if (this.state.tags.length > 7) { return this.setState({ tagserrmsg: "ONLY 8 TAGS ALLOWED" }) }
            else if (this.state.tags.indexOf(event.target.value.toUpperCase()) !== -1) { return this.setState({ tagserrmsg: 'TAG ALREADY ADDED' }) }
            else {
                this.setState({ tagserrmsg: "" })
            }
            let arr = this.state.tags;
            arr.push(event.target.value.toUpperCase())
            this.setState({ tags: arr })
            event.target.value = ""
        }
    }

    removeTag(indextoremove) {
        let arr = this.state.tags.filter((current, index) => {
            return index !== indextoremove
        })
        this.setState({ tags: arr, tagserrmsg: "" })
    }

    assignDesc = (obj) => {
        if (obj.getPlainText().length < 50 && obj.getPlainText().length !== 0) { return this.setState({ desc: convertToRaw(obj), descfilled: obj.hasText(), shortdesc: true }) }
        else { this.setState({ shortdesc: false }) }
        this.setState({ desc: convertToRaw(obj), descfilled: obj.hasText() });
    }
    changehandler(event) {
        event.preventDefault()
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    clickhandler(user, appenddoubt, addnotification) {
        if (this.state.title === "") { return this.setState({ errmsg: "Title is required" }) }
        else if (this.state.tags.length === 0) { return this.setState({ errmsg: "At least one tag required" }) }
        else if (this.state.descfilled === false) { return this.setState({ errmsg: "Description required" }) }
        else if (this.state.title.length < 10) { return this.setState({ errmsg: "Title must be at least 10 characters " }) }
        else if (this.state.title.length > 200) { return this.setState({ errmsg: "Title can be maximum of 200 characters,use description for more explanation " }) }
        else if (this.state.shortdesc === true) { return this.setState({ errmsg: "Description must be at least 50 characters long" }) }
        else { this.setState({ errmsg: "LOADING" }) }
        const doubtdata = new FormData()
        doubtdata.append('title', this.state.title)
        doubtdata.append('description', JSON.stringify(this.state.desc))
        doubtdata.append('image', this.state.image)
        doubtdata.append('tags', this.state.tags)
        doubtdata.append('code', this.state.code)
        doubtdata.append('username', user.userName)
        doubtdata.append('userid', user._id)
        doubtdata.append('user_doubts', user.doubts)
        doubtdata.append('dpimage', user.dp)
        doubtdata.append('user', JSON.stringify(user))
        axios.post('https://resolve4.herokuapp.com/doubt/upload_doubt', doubtdata, { withCredentials: true, headers: { "Content-Type": 'multipart/form-data' } })
            .then((res) => {
                if (res.data.status === true) {
                    appenddoubt(res.data.user_doubts)
                    this.setState({ errmsg: "", redirect: res.data.doubt, descfilled: true, shortdesc: false })
                    addnotification(res.data.notification)
                }
                else { console.log(res.data.err) }
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
                        <React.Fragment>
                            {object.isLogged === true ? object.user.email_verified === true ? null : <NonCLoseableModalForUnverified /> : <NonCloseableModalForLogin />}
                            {this.state.redirect === "nodoubt" ? null : <Redirect to={`/doubts/${this.state.redirect}`} exact="true" strict="true" />}
                            <br /><br />
                            <form className="DoubtForm" style={{ margin: "auto" }} >
                                <div className="Maintext"><span style={{ color: "red" }}>*</span>Title</div>
                                <div className="Subtext">Write the title of your question in max 50 words.</div>
                                <input className="Titletext" style={{ border: 'none', backgroundColor: "#293c6f", color: "#d8faff" }} type='text' placeholder="Title" name="title" onChange={this.changehandler} />
                                <hr style={{ backgroundColor: '#5bc0de' }} />
                                <div className="Maintext">Code</div>
                                <div className="Subtext">Insert code here (Optional).</div>
                                <textarea className="Codetext" style={{ border: 'none', backgroundColor: "#293c6f", color: "#d8faff" }} placeholder='Code' name='code' onChange={this.changehandler} />
                                <hr style={{ backgroundColor: '#5bc0de' }} />
                                <div className="Maintext"><span style={{ color: "red" }}>*</span>Tags</div>
                                <div className="Subtext">Add some relevant tags to describe your question.</div>
                                {this.state.tagserrmsg === "" ? null : <div style={{ color: "#5bc0de" }}>{this.state.tagserrmsg.toUpperCase()}</div>}
                                {}
                                <InputTags tags={this.state.tags} addTag={this.addTag} removeTag={this.removeTag} />
                                <hr style={{ backgroundColor: '#5bc0de' }} />
                                <div className="Maintext"><span style={{ color: "red" }}>*</span>Description</div>
                                <div className="Subtext">Write the description of your question</div>
                                <InputDesc assignDesc={this.assignDesc} placeholder="Write the description" imageAllowed={true} imagehandler={this.imagehandler} removeimage={this.removeimage} image={this.state.imageName}
                                />
                                <hr style={{ backgroundColor: '#5bc0de' }} />
                                <div className='btn btn-info' onClick={() => { this.clickhandler(object.user, object.appenddoubt, object.addnotification) }} >Submit</div>
                                {this.state.errmsg === "" ? null :
                                    this.state.errmsg === "LOADING" ? <div class="spinner-border text-info" style={{ marginLeft: "5%" }} role="status"><span class="sr-only">Loading...</span></div> : <div style={{ color: "#5bc0de", fontSize: "20pt" }}><b>!!!{this.state.errmsg.toUpperCase()}</b></div>}
                            </form>
                        </React.Fragment>
                    )
                }}
            </ProductConsumer>
        )
    }
}
export default AskDoubt




