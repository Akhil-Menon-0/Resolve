import React from 'react'
import { Link } from 'react-router-dom'

function ProblemPage() {
    return (
        <React.Fragment>
            <div className="jumbotron jumbotron-fluid" style={{backgroundColor:"#031227",color:"#FFF5EE"}}>
  <div className="container" style={{textAlign:"center"}}>
    <h1 className="display-4" align="center">Error</h1>
    <p className="lead" style={{textAlign:"center"}}><h2 className='' align='center'>The email of your google account is already registered.<br/>Login with that account or signup with a new email.</h2><br/>
           <div><Link to='/' exact="true" strict="true" style={{textAlign:"center"}}><div className="btn btn-info">Home</div></Link></div></p>
  </div>
</div>
        </React.Fragment>
    )
}


{/* <h2 className='alert alert-primary' align='center'>The email of your google account is already registered,login with that account or signup with a new account</h2>
            <Link to='/' exact="true" strict="true"><h4 className='alert alert-secondary' align='center'>LINK TO HOME PAGE</h4></Link> */}
export default ProblemPage