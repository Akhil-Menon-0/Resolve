import React from "react";

function HomeDoubtCard(props) {
    let des = ""
    let arr = JSON.parse(props.doubt.description).blocks
    let count = 0;
    for (let i of arr) {
        if (i.text.length + count > 150) {
            let remaining = 320 - count
            des = des + i.text.substring(0, remaining) + "..."
            break
        }
        des = des + i.text + " "
        count = count + i.text.length + 1
    }

    if (props.index === 0) {
        return (
            <div className='carousel-item active' style={{ width: '100%' }}>
                <div className='d-block w-100' id="mainhomecard">
                    <h4 className="card-title" id="hometitle">
                        <strong>{props.doubt.title}</strong>
                    </h4>
                    <div className="card-body">
                        <hr style={{ backgroundColor: '#5bc0de' }} />
                        <p className="card-text" id="hometext">
                            <br />{des}
                        </p>
                        <hr style={{ backgroundColor: '#5bc0de' }} />
                        <div className="col">
                            <div id="home-replies-views">
                                <span>
                                    <p style={{ color: "#d8faff" }}>{props.doubt.num_of_replies}</p>
                                    <svg width='1.5rem' aria-hidden="true" focusable="false" data-prefix="far" data-icon="comment" className="svg-inline--fa fa-comment fa-w-16 icons rep-view-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path width='1.5rem' color="#d8faff" fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29 7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160-93.3 160-208 160z" />
                                    </svg>
                                </span>
                                <span>
                                    <p style={{ color: "#d8faff" }}>{props.doubt.views}</p>
                                    <svg width='1.5rem' aria-hidden="true" focusable="false" data-prefix="far" data-icon="eye" className="svg-inline--fa fa-eye fa-w-18 icons rep-view-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                        <path width='1.5rem' color="#d8faff" fill="currentColor" d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className='carousel-item' style={{ width: '100%' }}>
                <div className='d-block w-100' id="mainhomecard">
                    <h4 className="card-title" id="hometitle">
                        <strong>{props.doubt.title}</strong>
                    </h4>
                    <div className="card-body" id="hometext">
                        <hr style={{ backgroundColor: '#5bc0de' }} />
                        <p className="card-text">
                            <br />{des}
                        </p>
                        <hr style={{ backgroundColor: '#5bc0de' }} />
                        <div className="col">
                            <div id="home-replies-views">
                                <span>
                                    <p style={{ color: "#d8faff" }}>{props.doubt.num_of_replies}</p>
                                    <svg width='1.5rem' aria-hidden="true" focusable="false" data-prefix="far" data-icon="comment" className="svg-inline--fa fa-comment fa-w-16 icons rep-view-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path width='1.5rem' color="#d8faff" fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29 7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160-93.3 160-208 160z" />
                                    </svg>
                                </span>
                                <span>
                                    <p style={{ color: "#d8faff" }}>{props.doubt.views}</p>
                                    <svg width='1.5rem' aria-hidden="true" focusable="false" data-prefix="far" data-icon="eye" className="svg-inline--fa fa-eye fa-w-18 icons rep-view-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                        <path width='1.5rem' color="#d8faff" fill="currentColor" d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default HomeDoubtCard