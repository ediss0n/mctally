/**
* Multicam tally application - Camera component
* 
* Displays camera and pulls the handles
* @author eduard.genzora
*/
import React, { Component } from 'react';
import LangText from './Lang';
import texts from './i18n';

class Camera extends Component {
  constructor(props) {
    super(props);
    // Only five type of shots awhile for two languages
    // and each camera listen only own branch in db
    // it maybe will store in prefs, so it's separated from Lang component
    this.state = { 
      collapsed: props.collapsed || false,
      shots: { 
        eng: ["Close-up", "Medium", "American", "Full", "Long"],
        rus: ["Крупный", "Средний", "Второй средний", "Общий", "Дальний"]
      },
      cam_ref:  props.db.child('cam' + props.num),
      edit: (this.props.role === 0 || this.props.num === this.props.role)
    };
    this.toggleExpand = this.toggleExpand.bind(this);
    this.listenChange = this.listenChange.bind(this);
    this.setShot = this.setShot.bind(this);
    // Every camera track own db ref
    this.state.cam_ref.on('value', this.listenChange);
  }
  
  // This can be one-string JQuery in bootstrap but we are in 2017...
  toggleExpand(e) {
    if (!this.state.edit) {
      e.preventDefault();
      return false;
    }
    this.setState({ collapsed: !this.state.collapsed });
  }
  
  /**
  * "One side" workflow - Down
  * Cameras reflect changes from DB not from their own events
  */
  listenChange(snapshot) {
    let cur_status = parseInt(snapshot.val().status, 10);
    this.setState({
      currentStatus: cur_status,
      currentShot: (cur_status === 0) ? this.state.shots[this.props.lang][snapshot.val().shot] : texts.changing[this.props.lang],
      currentShotId: snapshot.val().shot
    });
    // It might be very useful excepting iOS :( 
    if ("vibrate" in navigator) {
      navigator.vibrate(500);
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
    this.state.cam_ref.set({
      shot: parseInt(e.target.href.split('_')[1], 10),
      status: (this.state.currentStatus + 1) % 2
    });
  }
  
  /**
  * Display shots, change it, toggle shots pane, display current shot
  */
  render() {
    return (
      this.props.num !== 0 ?
      <div className="card">
        <div className={"card-header cam-head"+((this.state.currentStatus) ? ' bg-warning' : '' )} 
             onClick={this.toggleExpand}>
          {this.props.name}: {this.state.currentShot || 'none'}
        </div>
        <div className={'card-body collapse ' + (!this.state.collapsed ? 'show' : '')}>
          <p className="card-text"><LangText str="cam_text" lang={this.props.lang} /></p>
          {this.state.shots[this.props.lang].map((shot_name, id_shot) => 
            <div className="pt-3" key={id_shot}>
              <a href={"#shot_" + id_shot} onClick={this.setShot} 
                 className={"btn "+ ((this.state.currentShotId === id_shot) ? 
                                    ((!this.state.currentStatus) ? 'btn-primary' : 'btn-warning') : 
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

export default Camera;