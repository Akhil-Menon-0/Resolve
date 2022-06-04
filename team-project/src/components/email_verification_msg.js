import React from 'react'
import { Link } from 'react-router-dom'

function EmailVerification(props) {
    let message = props.done === "1" ? "Email Verified." : "Error Verifying.The link you clicked must be invalid"
    return (
        <React.Fragment>
            <div className="jumbotron jumbotron-fluid" style={{ backgroundColor: "#031227", color: "#FFF5EE" }}>
                <div className="container" style={{ textAlign: "center" }}>
                    <h1 className="display-4" align="center">{message}</h1>
                    <p className="lead" style={{ textAlign: "center" }}><br />
                        <div><Link to='/' exact="true" strict="true" style={{ textAlign: "center" }}><div className="btn btn-info">Home</div></Link></div></p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default EmailVerification






// <h2 className='alert alert-primary' align='center'>{props.done === "1" ? "email verified" : "Error verfying"}</h2>
//             <Link to='/' exact="true" strict="true"><h4 className='alert alert-secondary' align='center'>LINK TO HOME PAGE</h4></Link>