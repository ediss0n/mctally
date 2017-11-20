/**
* Multicam tally application - Login screen
* 
* @author eduard.genzora
*/
import React, { Component } from 'react';
import logo from './logo.svg';
import LangText from './Lang';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      pass: '',
      role: 1,
      lang: localStorage.getItem('mc_lang') || 'eng'
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }  
  
  /**
  * Controlled input case
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
    // it's a parent's trouble
    this.props[event.target.name + '_handle'](this.state);
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
            <LangText str="login_text" lang={this.state.lang} />
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
            <label><LangText str="password" lang={this.state.lang} /></label>
            <input type="password" name="pass" className="form-control" 
                   id="passInp" placeholder="Password" 
                   value={this.state.pass} onChange={this.handleInputChange} />
          </div>
      
          <div className="form-group">
            <label><LangText str="role" lang={this.state.lang} /></label>
            <select className="form-control" id="roleSel" name="role" value={this.state.role} onChange={this.handleInputChange}>
              <option value="1"><LangText str="cam1" lang={this.state.lang} /></option>
              <option value="2"><LangText str="cam2" lang={this.state.lang} /></option>
              <option value="3"><LangText str="cam3" lang={this.state.lang} /></option>
              <option value="0"><LangText str="director" lang={this.state.lang} /></option>
            </select>
          </div>      
      
          <div className="form-group">
            <label><LangText str="language" lang={this.state.lang} /></label>
            <select className="form-control" id="langSel" name="lang" value={this.state.lang} onChange={this.handleInputChange}>
              <option value="eng">English</option>
              <option value="rus">Русский</option>
            </select>
          </div>        
          
          <div className="row">
            <div className="col d-flex flex-row">
              <button name="create" className="btn btn-success" onClick={this.handleSubmit}>
                <LangText str="create_ses" lang={this.state.lang} />
              </button>
            </div>      
            <div className="col d-flex flex-row-reverse">
              <button name="enter" className="btn btn-primary" onClick={this.handleSubmit}>
                <LangText str="enter_ses" lang={this.state.lang} />
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;