import React from "react"
import axios from 'axios'

class TagsInput extends React.Component {

    constructor() {
        super()
        this.state = {
            curtagvalue: "",
            tags: [],
            suggestions: []
        }
        this.changehandler = this.changehandler.bind(this)
        this.tagiconclick = this.tagiconclick.bind(this)
    }

    tagiconclick() {
        let e = {
            key: 'Enter',
            target: {
                value: this.state.curtagvalue
            }
        }
        this.props.addTag(e)
        this.setState({ curtagvalue: "", suggestions: [] })
    }

    changehandler(event) {
        if (event.target.value.length > 20) { return }
        let tagvalue = event.target.value.toUpperCase();
        this.setState({ suggestion: [], curtagvalue: tagvalue })
        if (tagvalue === "") { return this.setState({ suggestions: [] }) }
        let arr = this.state.tags.map((item) => {
            let result = item.content.indexOf(tagvalue)
            let len = tagvalue.length
            if (result === -1) { return null }
            else {
                return (
                    <div className='dropdown-item' onClick={() => { this.setState({ curtagvalue: item.content }) }}>
                        <span style={{ color: '#5bc0de', marginLeft: "10%", marginRight: "10%" }}>
                            {item.content.substring(0, result)}
                            <b>{item.content.substring(result, result + len)}</b>
                            {item.content.substring(result + len, item.content.length)}
                        </span>
                        <span style={{ color: '#5bc0de', marginLeft: "10%", marginRight: "10%" }}>
                            {item.occurences}
                        </span>
                    </div >
                )
            }
        })
        this.setState({ suggestions: arr })
    }

    componentDidMount() {
        this.setState({ init: true });
        axios.get(`https://resolve4.herokuapp.com/doubt/getalltags`, { withCredentials: true, headers: { "Content-Type": "application/json" } })
            .then((res) => {
                this.setState({ tags: res.data.tags })
            })
            .catch((err) => { console.log(err); })
    }

    render() {
        let components = this.props.tags.map((current, index) => {
            return (
                <span key={index} align='center' className='col' style={{ padding: "0%", borderRadius: "5px", overflowWrap: "normal", margin: "1.5%", border: "2px dotted #293c6f", color: "#d8faff" }}>
                    <strong>{current}</strong>
                    <svg style={{ marginLeft: "1%", cursor: "pointer" }} onClick={() => { this.props.removeTag(index) }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="15px" height="15px"><path fill="#5bc0de" d="M8 9.704L4.057 13.646 2.354 11.943 6.296 8 2.354 4.057 4.057 2.354 8 6.296 11.943 2.354 13.646 4.057 9.704 8 13.646 11.943 11.943 13.646z" /><path fill="#5bc0de" d="M11.943,2.707l1.35,1.35L9.704,7.646L9.35,8l0.354,0.354l3.589,3.589l-1.35,1.35L8.354,9.704L8,9.35 L7.646,9.704l-3.589,3.589l-1.35-1.35l3.589-3.589L6.65,8L6.296,7.646L2.707,4.057l1.35-1.35l3.589,3.589L8,6.65l0.354-0.354 L11.943,2.707 M11.943,2L8,5.943L4.057,2L2,4.057L5.943,8L2,11.943L4.057,14L8,10.057L11.943,14L14,11.943L10.057,8L14,4.057 L11.943,2L11.943,2z" /></svg>
                </span>
            )
        })
        return (
            <React.Fragment>
                <div className="row">{components}</div>
                <input className="Tagtext" style={{ backgroundColor: "#293c6f", color: "#d8faff" }} value={this.state.curtagvalue} type='text' onChange={this.changehandler} onKeyUp={(e) => { if (e.key !== "Enter") { return } this.setState({ curtagvalue: "", suggestions: [] }); this.props.addTag(e) }} placeholder='Press enter to insert a TAG or click the icon' />
                <span data-toggle="tooltip" data-placement="top" title="Press this or enter key to insert current tag" style={{ marginLeft: "1%" }}>
                    <svg onClick={this.tagiconclick} class="svg-icon" aria-hidden="true" viewBox="0 0 20 20" style={{ hieght: "30px", width: "30px", cursor: 'pointer' }}>
                        <path fill="#293c6f" d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>
                    </svg>
                </span>
                <div className="dropown-menu" style={{ width: "30%", marginLeft: "5%", }}>
                    {this.state.suggestions}
                </div>
            </React.Fragment >
        )
    }

}

export default TagsInput