import React from "react";
import { Link, Redirect } from "react-router-dom";
import { ProductConsumer } from "./context";
import ModalComp from "react-modal";

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        borderColor: "rgb(31,48,74)",
        borderWidth: "5px",
        borderRadius: "2rem",
        backgroundColor: "#5bc0de"
    }
};


class Noncloseablemodalforunverified extends React.Component {
    render() {
        return (
            <ModalComp isOpen={true} style={customStyles} ariaHideApp={false}>
                <div className='text-center'>
                    <h3 style={{ color: '#212529' }}>Your email must be verifed for posting doubt</h3>
                    <h4 style={{ color: '#212529' }}>Search for email on your registered email account or go to My Profile page to recieve an email for verification or update your email</h4>
                    <div className='d-flex justify-content-around'>
                        <div ><Link to='/private_user_profile' exact={true} strict={true}><strong>My Profile</strong></Link></div>
                        <div ><Link to='' exact={true} strict={true}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40px" height="40px"><path fill="#05386B" d="M7.9,256C7.9,119,119,7.9,256,7.9C393,7.9,504.1,119,504.1,256c0,137-111.1,248.1-248.1,248.1C119,504.1,7.9,393,7.9,256z" /><path fill="#fdfcfa" d="M408.1,206.8l-150.1-74.9c-1.3-0.6-2.7-0.6-4,0l-150.2,74.9c-1.7,0.8-2.7,2.4-2.7,4.3v29.6c0,1.6,0.8,3.1,2.2,4c1.4,0.9,3.1,1,4.5,0.3l148.2-74l148.1,74c0.6,0.3,1.3,0.5,2,0.5c0.9,0,1.8-0.2,2.5-0.7c1.4-0.9,2.2-2.4,2.2-4V211C410.8,209.2,409.8,207.5,408.1,206.8z" /><path fill="#fdfcfa" d="M380.5 245.8L256 183.8 131.5 245.8 131.5 360.8 200.5 360.8 200.5 272.6 248 272.6 248 360.8 380.5 360.8z" /><path fill="#fdfcfa" d="M263.7 272.6H295.7V304.6H263.7z" /></svg>
                        </Link></div>
                    </div>
                </div>
            </ModalComp>
        )
    }
}

export default Noncloseablemodalforunverified