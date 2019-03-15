import React from "react";

class ScoreRow extends React.Component {

    render() {

        const data = this.props.data;
        const loading = this.props.loading;

        if(loading) {
            return(<td>...</td>)
        }
        else {
            return(<td>{data}</td>)
        }
    }
}

export default ScoreRow;