import React from "react"
import { Link } from "react-router-dom"
import axios from 'axios'
import HomeDoubtCard from './HomeDoubtCard'

class Home extends React.Component {

    constructor() {
        super()
        this.state = {
            doubts: [],
            init: true,
        }
        this.fetchmore = this.fetchmore.bind(this)
    }

    fetchmore() {
        let skip = this.state.doubts.length;
        axios.get(`https://resolve4.herokuapp.com/doubt/homegetall/${skip}`, { withCredentials: true, headers: { "Content-Type": "application/json" } })
            .then((result) => {
                if (result.data.status === false) { console.log(result.data.error) }
                else {
                    let index = skip - 1;
                    let doubts = result.data.doubts.map((doubt) => {
                        index++;
                        return (
                            <HomeDoubtCard doubt={doubt} index={index} key={index} id={index} />
                        )
                    })
                    let temp = this.state.doubts.concat(doubts);
                    this.setState({ doubts: temp, init: false })
                }
            })
            .catch((err) => { console.log(err) })

    }

    componentDidMount() {
        this.setState({ init: true })
        this.fetchmore();
    }

    render() {
        if (this.state.init === true) {
            return (
                <div className="spinner-grow text-info" role="status" style={{ marginLeft: "48%", marginTop: "18%", transform: "scale(3)" }}>
                    <span className="sr-only text-center mx-auto my-auto">Loading...</span>
                </div>
            )
        }
        return (
            <React.Fragment>
                <div className='container' style={{ marginTop: '8%', color: '#d8faff', fontFamily: 'Righteous' }}>
                    <div className='row'>
                        <div className='col-3'></div>
                        <div className='col'>
                            <strong><span style={{ fontSize: "30pt" }}>WELCOME</span><span style={{ fontSize: "20pt" }}> to the</span>
                                <br />
                                <span style={{ fontSize: "33pt" }}><span style={{ color: '#5bc0de' }}>RESOLVE</span> community!</span></strong>
                        </div>
                        <div className='col-3'></div>
                    </div>
                    <br />
                    <div className='row'>
                        <div className='col-3'></div>
                        <div className='col'>
                            <span style={{ fontSize: "15pt" }}>Stuck with any doubt about anything?</span>
                            <br />
                            <span style={{ fontSize: "15pt" }}>get it </span><span style={{ fontSize: "25pt", color: '#5bc0de' }}>RESOLVED</span>
                        </div>
                        <div className='col-3'></div>
                    </div>
                    <hr style={{ marginTop: '10%', backgroundColor: '#5bc0de' }} />
                    <div className='row' style={{ marginTop: '5%' }}>
                        <div className='col-3'></div>
                        <div className='col'><span style={{ color: '#d8faff', fontSize: '25pt' }}><strong>EXPLORE....</strong></span></div>
                        <div className='col-3'></div>
                    </div>
                    <div className='row' style={{ marginTop: '3%' }}>
                        <div className='col-lg-9'>
                            <div id="carouselExampleControls" className="carousel slide" data-ride="carousel" data-interval="3000">
                                <div className="carousel-inner">
                                    {this.state.doubts}
                                    <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="sr-only">Previous</span>
                                    </a>
                                    <a onClick={this.fetchmore} className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="sr-only">Next</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className='col' align='center'>
                            <Link to='/top_users' exact strict><div className='btn' id='buthover' style={{ transform: 'Scale(1.5)', margin: '10%' }}>Top Users</div></Link>
                            <Link to="/top_doubts" exact strict ><div className='btn' id='buthover' style={{ transform: 'Scale(1.5)', margin: '10%' }}>Top Doubts</div></Link>
                        </div>
                    </div>
                    <hr style={{ marginTop: '10%', backgroundColor: '#5bc0de' }} />
                </div>
            </React.Fragment >
        )
    }
}
export default Home
