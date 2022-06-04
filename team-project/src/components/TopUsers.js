import React from "react"
import axios from 'axios'
import UserRankCard from './UserRankCard'

class Invalid_Page extends React.Component {

    constructor() {
        super()
        this.state = {
            users: [],
            next: [],
            page: 1,
            init: false,
            count: 0
        }
        this.paging = this.paging.bind(this);
    }

    paging() {
        let curusers = this.state.users
        let newusers = this.state.next
        curusers = curusers.concat(newusers)
        this.setState({ users: curusers })
        let page = this.state.page
        axios.get(`https://resolve4.herokuapp.com/auth/getallusers/${page}`, { withCredentials: true, headers: { "Content-Type": "application/json" } })
            .then((res) => {
                if (res.data.status === false) { console.log(res.data.err) }
                else {
                    let sortedresult = res.data.users
                    let c = this.state.count
                    //sortedresult.sort(this.comparator)
                    let sortedresultcomp = sortedresult.map((user) => {
                        c++;
                        return <React.Fragment>
                            <UserRankCard user={user} key={user._id} rank={c} />
                        </React.Fragment>
                    })
                    this.setState({ next: sortedresultcomp, page: page + 1, count: c })
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({ init: false })
            })
    }

    componentDidMount() {
        this.setState({ init: true, count: 0, page: 1, users: [], next: [] })
        axios.get('https://resolve4.herokuapp.com/auth/getallusers/1', { withCredentials: true, headers: { "Content-Type": "application/json" } })
            .then((res) => {
                if (res.data.status === false) { console.log(res.data.err) }
                else {
                    let sortedresult = res.data.users
                    //sortedresult.sort(this.comparator)
                    let c = 0;
                    let sortedresultcomp = sortedresult.map((user) => {
                        c++;
                        return <React.Fragment>
                            <UserRankCard user={user} key={user._id} rank={c} />
                        </React.Fragment>
                    })
                    this.setState({ users: sortedresultcomp, page: 2, count: 5 })
                }
                this.setState({ init: false })
                axios.get('https://resolve4.herokuapp.com/auth/getallusers/2', { withCredentials: true, headers: { "Content-Type": "application/json" } })
                    .then((res) => {
                        if (res.data.status === false) { console.log(res.data.err) }
                        else {
                            let sortedresult = res.data.users
                            let c = 5;
                            //sortedresult.sort(this.comparator)
                            let sortedresultcomp = sortedresult.map((user) => {
                                c++;
                                return <React.Fragment>
                                    <UserRankCard user={user} key={user._id} rank={c} />
                                </React.Fragment>
                            })
                            this.setState({ next: sortedresultcomp, page: 3, count: 10 })
                        }
                    })
            })
            .catch((err) => {
                console.log(err);
                this.setState({ init: false })
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
            return (
                <React.Fragment>
                    <div className='container'>

                        <hr />
                        {this.state.users}
                    </div>
                    {this.state.next.length > 0 ? <div style={{ textAlign: 'center' }}>
                        <button id="Paging_more" onClick={this.paging} >MORE</button></div> : null}
                </React.Fragment>
            )
        }
    }
}
export default Invalid_Page
