/**
* Multicam tally application - Camera component
* 
* Displays camera and pulls the handles
* @author eduard.genzora
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeCameraState } from '../actions';
import LangText from './Lang';
import texts from '../i18n';

// Props mapping
function linkProps(state) {
  return {
    lang: state.lang,
    role: state.role,
    cams: state.cams,
    session: state.session_ref
  };
}

class Camera extends Component {
  constructor(props) {
    super(props);
    
    // Only five type of shots awhile for two languages
    // and each camera listen only own branch in store
    // it maybe will store in prefs, so it's separated from Lang component    
    this.shots = { 
        eng: ["Close-up", "Medium", "American", "Full", "Long"],
        rus: ["Крупный", "Средний", "Второй средний", "Общий", "Дальний"]
    };
    
    this.state = { 
      collapsed: props.collapsed || false,
      edit: (props.role === 0 || props.num === props.role)
    };
    this.toggleExpand = this.toggleExpand.bind(this);
    this.setShot = this.setShot.bind(this);
  }
  
  // This can be one-string JQuery in bootstrap but we are in 2017...
  toggleExpand(e) {
    if (!this.state.edit) {
      e.preventDefault();
      return false;
    }
    this.setState({ collapsed: !this.state.collapsed });
  }
  
  componentDidUpdate(prevProps) {
    let cam_ref = this.props.cams['cam' + this.props.num]; 
    if (prevProps.cams['cam' + prevProps.num].status !== cam_ref.status || 
        prevProps.cams['cam' + prevProps.num].shot !== cam_ref.shot) {

        // It might be very useful excepting iOS :( 
        if ("vibrate" in navigator) {
          navigator.vibrate(500);
        }  

        // Let's talk
        this.props.dictor.build(
          this.props.num, 
          cam_ref.shot, 
          cam_ref.status, 
          this.shots
        );
    }
  }
  
  /**
  * "One side" workflow - Up
  * Cameras send changes to DB does not changing their own state
  */  
  setShot(e) {
    // According role
    if (!this.state.edit) {
      e.preventDefault();
      return false;
    }   
    
    this.props.dispatch(changeCameraState(this.props.session, {
      cam: 'cam' + this.props.num,
      shot: parseInt(e.target.href.split('_')[1], 10),
      status: (this.props.cams['cam' + this.props.num].status + 1) % 2,
      changedAt: Date.now()
    }));

    e.preventDefault();
  }
  
  /**
  * Display shots, change it, toggle shots pane, display current shot
  */
  render() {
    // Shorthands
    let cur_status = parseInt( this.props.cams['cam' + this.props.num].status, 10);
    let cur_shot = (cur_status === 0) ? this.shots[this.props.lang][this.props.cams['cam' + this.props.num].shot] : texts.changing[this.props.lang];
    let currentShotId = this.props.cams['cam' + this.props.num].shot;
    
    return (
      this.props.num !== 0 ?
      <div className="card">
        <div className={"card-header cam-head"+((cur_status) ? ' bg-warning' : '' )} 
             onClick={this.toggleExpand}>
          {this.props.name}: {cur_shot || 'none'}
        </div>
        <div className={'card-body collapse ' + (!this.state.collapsed ? 'show' : '')}>
          <p className="card-text"><LangText str="cam_text"/></p>
          {this.shots[this.props.lang].map((shot_name, id_shot) => 
            <div className="pt-3" key={id_shot}>
              <a href={"#shot_" + id_shot} onClick={this.setShot} 
                 className={"btn "+ ((currentShotId === id_shot) ? 
                                    ((!cur_status) ? 'btn-primary' : 'btn-warning') : 
                                    'btn-secondary') +" btn-block"}>
                {shot_name}
              </a>
            </div> 
          )}
        </div>
      </div> : null
    );
  }
}

export default connect(linkProps)(Camera);