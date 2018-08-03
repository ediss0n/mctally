/**
* Multicam tally application - Login screen
* 
* @author eduard.genzora
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from '../logo.svg';
import LangText from './Lang';
import { submitLogin } from '../actions';
import { createSession, enterSession } from '../functions';

// Props mapping
function linkProps(state) {
  return {
    lang: state.lang,
    role: state.role
  };
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      pass: '',
      role: this.props.role,
      lang: this.props.lang
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }  
  
  /**
  * Controlled input 
  */
  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }  
  
  handleSubmit(event) {
    // Storing prefs in browser
    if (localStorage) {
      localStorage.setItem('mc_role',this.state.role);   
      localStorage.setItem('mc_lang',this.state.lang); 
    }
    
    // with redux we must handle it there
    if (event.target.name === 'create') {
      createSession(this.state); }
    else { 
      enterSession(this.state);
    }
    
    this.setState({ role: parseInt(this.state.role, 10)});
    
    // to update paret store, genering action
    this.props.dispatch(submitLogin({
      ...this.state
    }));

    event.preventDefault();
  }  
  
  // Hope it will fit on sceen
  render() {
    return (
      <div className="container">
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Multicam Tally</h2>
          </div>
          <p className="App-intro">
            <LangText str="login_text"/>
          </p>
        </div>      
        <form>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" className="form-control" 
                   id="emailInp" placeholder="Email" 
                   value={this.state.email} onChange={this.handleInputChange} />
          </div>
      
          <div className="form-group">
            <label><LangText str="password"/></label>
            <input type="password" name="pass" className="form-control" 
                   id="passInp" placeholder="Password" 
                   value={this.state.pass} onChange={this.handleInputChange} />
          </div>
      
          <div className="form-group">
            <label><LangText str="role"/></label>
            <select className="form-control" id="roleSel" name="role" value={this.state.role} onChange={this.handleInputChange}>
              <option value="1"><LangText str="cam1"/></option>
              <option value="2"><LangText str="cam2"/></option>
              <option value="3"><LangText str="cam3"/></option>
              <option value="0"><LangText str="director"/></option>
            </select>
          </div>      
      
          <div className="form-group">
            <label><LangText str="language"/></label>
            <select className="form-control" id="langSel" name="lang" value={this.state.lang} onChange={this.handleInputChange}>
              <option value="eng">English</option>
              <option value="rus">Русский</option>
            </select>
          </div>        
          
          <div className="row">
            <div className="col d-flex flex-row">
              <button name="create" className="btn btn-success" onClick={this.handleSubmit}>
                <LangText str="create_ses"/>
              </button>
            </div>      
            <div className="col d-flex flex-row-reverse">
              <button name="enter" className="btn btn-primary" onClick={this.handleSubmit}>
                <LangText str="enter_ses"/>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(linkProps)(Login);