import React from 'react'

function Footer() {
    return (
        <React.Fragment>
            <div className="footer" align="center">
                <strong>
                    <span>Follow us on <a href="https://github.com/Rahul172000" target="_blank">github</a></span>
                    <hr style={{ width: "30%" }} />
                    <span>More Work Of Ours On Internet</span>
                    <br />
                    <span className=''><a href="https://meme--generator.herokuapp.com/" target="_blank">MEME GENERATOR</a></span>
                    <span style={{ borderLeft: "1px solid black", opacity: 0.2, height: "70px", marginLeft: "1%", marginRight: "1%" }}></span>
                    <span className=''><span><a href='https://e-store-react.herokuapp.com/' target="_blank">E-store</a></span></span>
                </strong>
            </div>
        </React.Fragment>
    )
}

export default Footer