/**
* Multicam tally application
* 
* Serves to coordinate cameramans during multicamera event sooting
* @author eduard.genzora
*/

import React, { Component } from 'react';
import './App.css';

// Only 2 basic screens at while, so no need for react navigation 
import Login from './Login';
import Table from './Table';

// Yes, lets use a Google tools
import firebase from './Firebase';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { session: null, role: null };
    
    this.processAuth = this.processAuth.bind(this);
    this.storeTemplate = this.storeTemplate.bind(this);
    this.createSession = this.createSession.bind(this);
    this.enterSession = this.enterSession.bind(this);
    firebase.auth().onAuthStateChanged(this.processAuth);    
  }
  
  /**
  * Routines after authorizing
  */
  processAuth(user) {
      // Storing preferences in browser, why not,
      // and yes - i store database ref in state
      if (user) {
        this.setState({ 
          session: user.uid, 
          session_ref: firebase.database().ref('sessions/' + user.uid),
          role: parseInt(localStorage.getItem('mc_role'), 10) || 0,
          lang: localStorage.getItem('mc_lang') || 'eng'
        });
        
        // if it's new user, creating his branch, allowed for him only (fb pref)
        this.state.session_ref.once('value').then(function(snapshot) {
          if (!snapshot.val()) 
            this.storeTemplate();
        }.bind(this));
      } else {
        // logout is over
        this.setState({ session: null, role: null });
        if (localStorage) { 
          localStorage.setItem('mc_role','');
        }
      }    
  }
  
  /**
  * Lets stat with only 3 cameras (maybe extend it later)
  */
  storeTemplate() {
    this.state.session_ref.set({
      cam1: {shot: 0, status: 0},
      cam2: {shot: 0, status: 0},
      cam3: {shot: 0, status: 0}
    });
  }
  
  /**
  * Create new user
  * TODO: error processing
  */  
  createSession(data) {
    this.setState({ role: data.role });    
    firebase.auth().createUserWithEmailAndPassword(data.email, data.pass)
      .catch(function(error) {
        console.log(error);
      });    
  }
  
  /**
  * Login existing
  * TODO: error processing  
  */  
  enterSession(data) {
    this.setState({ role: data.role });
    firebase.auth().signInWithEmailAndPassword(data.email, data.pass)
      .catch(function(error) {
        console.log(error);
      });    
  }
  
  /**
  * Logout
  * TODO: error processing  
  */  
  leaveSession() {
    firebase.auth().signOut()
      .catch(function(error) {
        console.log(error);
      });
  }
  
  // Show target screen 
  render() {
    return (
      (!this.state.session) ? 
        <Login 
          create_handle={this.createSession} 
          enter_handle={this.enterSession} 
          lang={this.state.lang} /> : 
        <Table 
          role={this.state.role} 
          db={this.state.session_ref} 
          logout_handle={this.leaveSession} 
          lang={this.state.lang}/>
    );
  }
}

export default App;
