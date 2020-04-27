import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

class BerryDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNotFound: false,
            berryDetails: undefined,
            berryID: undefined
        }
    }

    async getBerryDetails() {
        try {
            let berry_id = this.props.match.params.id;
            const berry = await axios.get("https://pokeapi.co/api/v2/berry/" + berry_id);
            console.log(`berryData = ${JSON.stringify(berry)}`);
            this.setState({ berryDetails: berry.data, berryID: berry_id});
        } catch (err) {
            console.log(err);
            this.setState({ pageNotFound: true});
        }
    }

    componentDidMount() {
        this.getBerryDetails();
    }

    render() {
        let html_body = null;
        
        //ID, firmness, size, soil dryness, flavors 
        if (!this.state.pageNotFound) {
            let current_berry = this.state.berryDetails;
            let berry_id = current_berry && <p>ID: {this.state.berryID}</p>;
            let berry_title = current_berry && <h2 className="cap-first-letter">{current_berry.name}</h2>;
            let berry_size = current_berry && <p>Size: {current_berry.size}</p>;
            let berry_smoothness = current_berry && <p>Smoothness: {current_berry.smoothness}</p>;
            let berry_max_harvest = current_berry && <p>Max Harvest: {current_berry.max_harvest}</p>;
            let berry_soil_dryness = current_berry && <p>Soil Dryness: {current_berry.soil_dryness}</p>;
            let flavor_tag = current_berry && current_berry.flavors.map((berryFlavor) => (
                <li className="cap-first-letter" key={berryFlavor.flavor.name}>
                    {berryFlavor.flavor.name}
                </li>
            ));
            html_body = (
                <div>
                    {berry_title}
                    {berry_id}
                    {berry_size}
                    {berry_soil_dryness}
                    {berry_smoothness}
                    {berry_max_harvest}
                    <div className="row">
                        <div className="list_tags" style={{textAlight: "center"}}>
                            <p>Flavors:</p>
                            <ul className="list-unstyled">
                                {flavor_tag}
                            </ul>
                        </div>
                    </div>
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

export default BerryDetails;