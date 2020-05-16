/* @author medge */

import React from "react"
import { render } from "react-dom"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import Game from "./components/Game"
import LandingPage from "./components/LandingPage"

render(
  <Router>
    <Switch>
      <Route exact path="/">
        <LandingPage />
      </Route>
      <Route path="/game/:roomId">
        <Game />
      </Route>
    </Switch>
  </Router>,
  document.querySelector("#app")
)
