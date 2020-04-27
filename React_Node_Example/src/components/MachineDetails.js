import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

class MachineDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNotFound: false,
            machineDetails: undefined,
            machineID: undefined
        }
    }

    async getMachineDetails() {
        try {
            let machine_id = this.props.match.params.id;
            const machine = await axios.get("https://pokeapi.co/api/v2/machine/" + machine_id);
            console.log(`berryData = ${JSON.stringify(machine)}`);
            this.setState({ machineDetails: machine.data, machineID: machine_id});
        } catch (err) {
            console.log(err);
            this.setState({ pageNotFound: true});
        }
    }

    componentDidMount() {
        this.getMachineDetails();
    }

    render() {
        let html_body = null;
        
        //ID, firmness, size, soil dryness, flavors 
        if (!this.state.pageNotFound) {
            let current_machine = this.state.machineDetails;
            let machine_id = current_machine && <p>Machine ID: {this.state.machineID}</p>;
            let machine_title = current_machine && <h2 className="cap-first-letter">{current_machine.item.name}</h2>;
            let machine_version_group = current_machine && <p>Version Group Name: {current_machine.version_group.name}</p>
            let machine_move = current_machine && <p>Move Name: {current_machine.move.name}</p>
            html_body = (
                <div>
                    {machine_title}
                    {machine_id}
                    {machine_move}
                    {machine_version_group}
                </div>
            )
        } else {
            html_body = (
                <div>
                    <Redirect to="/nonexist" status={ 404 }/>
                </div>
            )
        }
        return html_body;
    }
}

export default MachineDetails;