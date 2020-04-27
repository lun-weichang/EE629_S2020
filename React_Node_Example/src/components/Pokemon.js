import React, { Component } from "react";
import { Switch, Route} from "react-router-dom";
import PokemonDetails from "./PokemonDetails";
import PokemonList from "./PokemonList";

class Pokemon extends Component {
	render() {
        let html_body = (
            <div>
                <Switch>
                    <Route path="/pokemon/page/:page" exact component={PokemonList} />
                    <Route path="/pokemon/:id" exact component={PokemonDetails} />
                </Switch>
            </div> 
        );
        return html_body;
    }
}

export default Pokemon;
