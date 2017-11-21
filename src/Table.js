/**
* Multicam tally application - Switching table screen
* 
* Screen where all camera components a layout 
* Want to use more appropriate name Switcher, but seems it used somwhere in React...
* @author eduard.genzora
*/

import React, { Component } from 'react';
import Camera from './Camera';
import LangText from './Lang';
import Speak from './Speak';

class Table extends Component {
  constructor(props) {
    super(props);
    // Sets of cameras for two languages (maybe'll extend it in future)
    // it maybe will store in prefs, so it's separated from Lang component
    this.state = { 
      role: props.role,  
      cameras: {
        eng: ["Director", "First camera", "Second camera", "Third camera"],
        rus: ["Режиссер", "Первая камера", "Вторая камера", "Третья камера"]
      }
    };
    // One for all cameras
    this.dictor = new Speak(props.lang, this.state.cameras);
  }  
  
  /**
  * As said - it's just layout, all magic in Camera components
  * Camera for current role always first, not so pretty, but only one loop
  */
  render() {
    return (
      <div className="container">
        <div className="row">
          {this.props.role !== 0 ?
          <div className="col-md cam-slot">
            <Camera 
              name={this.state.cameras[this.props.lang][parseInt(this.state.role, 10)]} 
              db={this.props.db} 
              role={this.props.role} 
              num={parseInt(this.state.role, 10)} 
              lang={this.props.lang}
              dictor={this.dictor} />
          </div> : ''      
          }
          {this.state.cameras[this.props.lang].map((cam, idx) => 
            idx !== parseInt(this.state.role, 10) && idx > 0 ? 
            <div className="col-md cam-slot" key={idx}>
              <Camera 
                name={cam} 
                collapsed={this.props.role !== 0} 
                db={this.props.db} 
                num={idx} 
                role={this.props.role} 
                lang={this.props.lang}
                dictor={this.dictor} />
            </div> : ''  
          )}
        </div>

        <div className="row pt-3">
          <div className="col d-flex flex-row-reverse">
            <button name="logout" className="btn btn-secondary" onClick={this.props.logout_handle}>
              <LangText str="exit_ses" lang={this.props.lang} />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Table;