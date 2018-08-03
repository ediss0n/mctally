/**
* Multicam tally application
* 
* Serves to coordinate cameramans during multicamera event sooting
* @author eduard.genzora
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initFirebase, getPrefs } from '../actions';
import '../App.css';

// Only 2 basic screens at while, so no need for react navigation 
import Login from './Login';
import Table from './Table';

// Props mapping
function linkPropsApp(state) {
  return {
    lang: state.lang,
    session: state.session,
    role: state.role
  };
}

class App extends Component {
  
  constructor(props) {
    super(props);
    this.props.dispatch(getPrefs());
    this.props.dispatch(initFirebase());
  }
  
  // Show target screen 
  render() {
    return (
      (!this.props.session) ? <Login/> : <Table/>
    );
  }
}

export default connect(linkPropsApp)(App);
