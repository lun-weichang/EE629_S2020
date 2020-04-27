import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import BerryDetails from "./BerryDetails";
import BerriesList from "./BerriesList";

class Berry extends Component {
	render() {
        let html_body = (
            <div>
                <Switch>
                    <Route path="/berries/page/:page" exact component={BerriesList} />
                    <Route path="/berries/:id" exact component={BerryDetails} />
                </Switch>
            </div> 
        );
        return html_body;
    }
}

export default Berry;
