import React, { Component } from "react";
import ServerStatus from "react-server-status";

class NonExist extends Component {
    render() {
        return (
            <ServerStatus status={ 404 }>
                <div>
                    <br />
                    <br />
                    <h1>404 Error, Page Not Found!</h1>
                    <p>Sorry the page does not exist.</p>
                </div>
            </ServerStatus>
        );
    }
}

export default NonExist;