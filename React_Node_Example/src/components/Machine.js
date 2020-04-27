import React, { Component } from "react";
import { Switch, Route} from "react-router-dom";
import MachineDetails from "./MachineDetails";
import MachinesList from "./MachinesList";
import NotExist from "./NotExist";

class Machine extends Component {
	render() {
        let html_body = (
            <div>
                <Switch>
                    <Route path="/machines/page/:page" exact component={MachinesList} />
                    <Route path="/machines/:id" exact component={MachineDetails} /> 
                </Switch>
            </div> 
        );
        return html_body;
    }
}

export default Machine;
