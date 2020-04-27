import React from "react";
import logo from "./img/pokemon_ball.png";
import "./App.css";
import Pokemon from "./components/Pokemon";
import Berry from "./components/Berry";
import Machine from "./components/Machine";
import NotExist from "./components/NotExist";

import { BrowserRouter as Router, Route, Link, Switch, Redirect} from "react-router-dom";

function App() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src ={logo} className="App-logo" alt="logo" />
            <h1 className="App-header">Welcome to the Pokemon Pokedex</h1>
          </header>
          <br/>
          <br/>
          <br/>
          <Link className="PokemonLink" to="/pokemon/page/0">
            Pokemon
          </Link>
          <br/>
          <Link className="BerriesLink" to="/berries/page/0">
            Berries
          </Link>
          <br/>
          <Link className="MachinesLink" to="/machines/page/0">
            Machines
          </Link>
          <div className="App-body">
            <Switch>
              <Route exact path="/" />
              <Route path="/pokemon" component={ Pokemon } />
              <Route path="/berries" component={ Berry } />
              <Route path="/machines" component={ Machine } />
              <Route path="/notexist" component={ NotExist } status={404} />
              <Redirect to="/notexist" />
            </Switch>
          </div>
        </div>
      </Router>
    );
}

export default App;
