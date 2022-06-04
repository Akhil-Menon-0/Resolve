import React from "react"
import DoubtCard from './DoubtCard'
import ModalForFilter from './ModalForFilter'
import axios from 'axios'

class TopDoubts extends React.Component {
    constructor() {
        super();
        this.state = {
            modalforfilterstatus: false,
            doubts: [],
            init: true,
            rawdoubts: []
        }
        this.modalon = this.modalon.bind(this);
        this.modalclose = this.modalclose.bind(this);
        this.applyfilter = this.applyfilter.bind(this);
    }

    applyfilter(tags) {
        this.setState({ init: true })
        let filterdoubts = this.state.rawdoubts.filter((doubt) => {
            let tagsarr = doubt.tags.split(',');
            for (let tag of tags) {
                if (tagsarr.includes(tag) === false) { return false; }
            }
            return true
        })
        let tempdoc = filterdoubts.map((doubt) => {
            return (<DoubtCard key={doubt._id} doubt={doubt} />)
        })
        this.setState({ init: false, doubts: tempdoc })
    }

    comparator(a, b) {
        if (a.views > b.views) { return -1; }
        else if (a.views < b.views) { return 1; }
        else {
            if (a.num_of_replies > b.num_of_replies) { return -1 }
            else if (a.num_of_replies < b.num_of_replies) { return 1; }
        }
        return 0
    }

    componentDidMount() {
        this.setState({ init: true })
        axios.get(`https://resolve4.herokuapp.com/doubt/getall`, { withCredentials: true, headers: { "Content-Type": "application/json" } })
            .then((res) => {
                let doubtsarr = res.data.doubts;
                doubtsarr.sort(this.comparator)
                let tempdoc = doubtsarr.map((doubt) => {
                    return (<DoubtCard key={doubt._id} doubt={doubt} />)
                })
                this.setState({ doubts: tempdoc, init: false, rawdoubts: doubtsarr })
            })
            .catch((err) => {
                console.log(err)
                this.setState({ init: false })
            })
    }

    modalon() {
        this.setState({ modalforfilterstatus: true });
    }

    modalclose() {
        this.setState({ modalforfilterstatus: false });
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
            return (
                <React.Fragment>
                    <ModalForFilter modalclose={this.modalclose} applyfilterhandler={this.applyfilter} modalforfilterstatus={this.state.modalforfilterstatus} />
                    <div className='container'>
                        <div className='row'>
                            <div className='btn btn-info col-2' onClick={() => { this.modalon() }} style={{ marginTop: '3%', marginLeft: "5%", marginRight: "2%" }}>FILTER</div>
                            {this.state.doubts.length === this.state.rawdoubts.length ? null : <div style={{ fontSize: "20px", marginTop: '3%', fontSize: "20px", color: '#d8faff' }} className='col-4'><i><b>FILTERS APPLIED</b></i></div>}
                            <span className="col" style={{ marginTop: '3%', fontSize: "20px", color: '#d8faff' }} align="right"><b>Total Doubts:{this.state.doubts.length}</b></span>
                        </div>
                    </div>
                    <br />
                    <br />
                    {this.state.doubts}
                </React.Fragment>
            )
        }
    }
}
export default TopDoubts
