import * as React from "react";
import { Switch, Route, BrowserRouter, Link } from "react-router-dom";

import Sudoku from "./modules/Sudoku";
import Snake from "./modules/Snake";

import { Header } from "./App.styles";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Header>
          <Link to="/sudoku" className="link">
            Sudoku
          </Link>
          <Link to="/snake" className="link">
            Snake
          </Link>
        </Header>
        <Switch>
          <Route path="/" exact>
            Default
          </Route>
          <Route path="/sudoku">
            <Sudoku />
          </Route>
          <Route path="/snake">
            <Snake />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
