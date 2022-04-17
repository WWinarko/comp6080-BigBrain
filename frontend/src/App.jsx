import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import EditQuiz from './Pages/EditQuiz';
import EditQuestion from './Pages/EditQuestion';
import AdminLobby from './Pages/AdminLobby';
import PlayerLobby from './Pages/PlayerLobby';
import AdminGame from './Pages/AdminGame';
import PlayerGame from './Pages/PlayerGame';
import ScrollToTop from './ScrollToTop';

export default function App() {
  return (
    <Router>
      <div>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <ScrollToTop />
        <Switch>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/edit">
            <EditQuiz />
          </Route>
          <Route path="/editQuestion">
            <EditQuestion />
          </Route>
          <Route path="/player/lobby">
            <PlayerLobby />
          </Route>
          <Route path="/admin/lobby">
            <AdminLobby />
          </Route>
          <Route path="/admin/game">
            <AdminGame />
          </Route>
          <Route path="/player/game">
            <PlayerGame />
          </Route>
          {(localStorage.getItem('token') !== null)
            ? <Redirect to="/dashboard" />
            : <Redirect to="/login" />}
        </Switch>
      </div>
    </Router>
  );
}
