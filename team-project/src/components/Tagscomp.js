import React from "react"

function TagsComp(props) {
    let color = null;
    if (props.index % 5 === 0) { color = 'warning' }
    else if (props.index % 5 === 1) { color = 'danger' }
    else if (props.index % 5 === 2) { color = "success" }
    else if (props.index % 5 === 3) { color = "dark" }
    else if (props.index % 5 === 4) { color = 'primary' }
    return (
        <a href="#" className={`btn btn-sm rounded-pill btn-${color}`} style={{margin:"1px"}}>{props.tag}</a>
    )
}

export default TagsComp; 