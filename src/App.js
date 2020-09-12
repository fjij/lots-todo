import React from 'react';
import { LoginPage, HomePage } from './pages';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/plate/:plateId/:itemKey">
            <HomePage/>
          </Route>
          <Route path="/plate/:plateId">
            <HomePage/>
          </Route>
          <Route path="/">
            <HomePage/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
