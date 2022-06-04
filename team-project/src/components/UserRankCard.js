import React from 'react'
import { Link } from 'react-router-dom'

function UserRankCard(props) {
  return (

    <div id="tags-hr" className="mt-3 pt-3 d-flex flex-column flex-sm-row flex-row">
      <div style={{ fontSize: "50px", color: "white" }}><br />{props.rank}</div>
      <div className="card p-0" id="main">
        <div className="card-body">
          <div id="tags-hr" className="tags-icons mt-3 pt-3 d-flex flex-column flex-sm-row justify-content-between">
            <div className="d-flex" style={{ paddingTop: "10px" }}>
              {props.user.dp === "" ? <div className="dp text-center" style={{ marginBottom: "15px" }}>{props.user.userName[0]}</div> :
                <div className="dp text-center mb-4" style={{ backgroundColor: "#031227", border: "1px solid #031227" }}><img style={{ height: "2em", width: "2em" }} src={"https://resolve4.herokuapp.com" + props.user.dp} /></div>}
              <div className="by-line align-self-center ml-3">
                <div style={{ color: "white", transform: "scale(1.1)" }}>{props.user.firstName + " " + props.user.lastName}</div>
                <div style={{ color: "white", transform: "scale(1.1)" }}>{props.user.userName}</div>
              </div>
            </div>
            <div className="ml-auto mt-2 mt-sm-0" style={{ marginTop: "10px", transform: "scale(1.5)", paddingRight: "10px" }}><br />Points : {props.user.points}</div>
          </div>
          <div className="d-flex justify-content-end"><Link to={`/public_user_profile/${props.user._id}`} exact="true" strict="true" style={{ textDecoration: "none" }}><div style={{ paddingTop: "20px", paddingBottom: "20px" }}>Visit Profile</div></Link></div>
        </div>
      </div>
    </div>
  )
}

export default UserRankCard





// <div className='row border' style={{ marginBottom: "2%", marg: "2%" }}>
//                 {props.user.dp === "" ? null :
//                     <img style={{ width: "10%", height: "9%" }} src={"http://localhost:2000" + props.user.dp} />}
//                 <br />
//                 <div className='col-6'>{props.user.firstName + " " + props.user.lastName}</div>
//                 <div className='col-2'>{props.user.points}</div>
//                 <div className='col-4'>{props.user.userName}</div>
//             </div>