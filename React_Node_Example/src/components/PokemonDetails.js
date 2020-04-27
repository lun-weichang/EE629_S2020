import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import pokemonBall from "../img/pokemon_ball.png";

class PokemonDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNotFound: false,
            pokemonDetails: undefined,
            pokemonID: undefined
        }
    }

    async getPokemonDetails() {
        try {
            let pokemon_id = this.props.match.params.id;
            const pokemon = await axios.get("https://pokeapi.co/api/v2/pokemon/" + pokemon_id);
            this.setState({ pokemonDetails: pokemon.data, pokemonID: pokemon_id});
            console.log(`%%%%%%%%%%%%%%%pokemon = ${pokemon}`);
        } catch (err) {
            console.log(err);
            this.setState({ pageNotFound: true});
        }
    }

    componentDidMount() {
        this.getPokemonDetails();
    }

    render() {
        let html_body = null;
        let pokemon_img;
        
        //Abilities, Moves, 
        if (!this.state.pageNotFound) {
            let current_pokemon = this.state.pokemonDetails;
            // let pokemon_img_url = this.state.pokemonDetails.sprites.front_default;
            let pokemon_id = current_pokemon && <p>ID: {this.state.pokemonID}</p>;
            let pokemon_title = current_pokemon && <h2 className="cap-first-letter">{current_pokemon.name}</h2>;
            let pokemon_height = current_pokemon && <p>Height: {current_pokemon.height}</p>;
            let pokemon_weight = current_pokemon && <p>Weight: {current_pokemon.weight}</p>;
            if (current_pokemon && current_pokemon.sprites.front_default !== null) {
                pokemon_img = <img className="detailImg" src={current_pokemon.sprites.front_default} alt={current_pokemon.name}/>
            } else {
                pokemon_img = current_pokemon && <img className="detailImg" src={pokemonBall} alt={current_pokemon.name}/>
            }
            let pokemon_exp = current_pokemon && <p>Base Experience: {current_pokemon.base_experience}</p>;
            let type_tag = current_pokemon && current_pokemon.types.map((pokemonType) => (
                <li className="cap-first-letter" key={pokemonType.slot}>
                    {pokemonType.type.name}
                </li>
            ));
            let ability_tag = current_pokemon && current_pokemon.abilities.map((pokemonType) => (
                <li className="cap-first-letter" key={pokemonType.slot}>
                    {pokemonType.ability.name}
                </li>
            ));
            let move_tag = current_pokemon && current_pokemon.moves.map((pokemonType) => (
                <li className="cap-first-letter" key={pokemonType.slot}>
                    {pokemonType.move.name}
                </li>
            ));
            html_body = (
                <div>
                    {pokemon_img}
                    {pokemon_title}
                    {pokemon_id}
                    {pokemon_exp}
                    {pokemon_weight}
                    {pokemon_height}
                    <div className="row">
                        <div className="list_tags" style={{textAlight: "center"}}>
                            <p>Type:</p>
                            <ul className="list-unstyled">
                                {type_tag}
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className="list_tags" >
                            <p>Abilities:</p>
                            <ul className="list-unstyled">
                                {ability_tag}
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className="list_tags" >
                            <p>Moves:</p>
                            <ul className="list-unstyled">
                                {move_tag}
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

export default PokemonDetails;