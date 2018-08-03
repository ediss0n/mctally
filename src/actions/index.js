/**
* All global actions 
* 
* @author eduard.genzora
*/

// Lets use a Google tools
import firebase from '../Firebase';
import { storeTemplate, leaveSession } from '../functions';

export function submitLogin(logdata) {
  return {
    type: 'SUBMIT_LOGIN',
    logdata
  }
}

export function submitLogout() {
  leaveSession();
  return {
    type: 'SUBMIT_LOGOUT'
  }
}

function hasAuthorized(user, session_ref) {
  return {
    type: 'AUTHORIZED',
    payload: {
      session: user.uid,
      session_ref  
    }
  }
}

function Logout() {
  return {
    type: 'LOGOUT',
    payload: {
      session: null,
      role: null
    }
  }
}

/**
* Routines after authorizing
*/
export function initFirebase() {
  return (dispatch) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const session_ref = firebase.database().ref('sessions/' + user.uid);
       
        // if it's new user, creating his branch, allowed for him only (firebase setting)
        session_ref.once('value').then(function(snapshot) {
          if (!snapshot.val()) 
            storeTemplate(session_ref);
        });
        
        session_ref.child('cams').on('child_changed', (snapshot) => dispatch(camsChanged(snapshot)));
        
        // And after that it will be in store 
        dispatch(hasAuthorized(user, session_ref));        
      } else {
        // logout is over
        dispatch(Logout());
      }    
    });
  }
}

/**
* Action for initial cam change status
*/
export function changeCameraState(session, newstate) {
  
  session.child('cams/'+newstate.cam).set({
    shot: newstate.shot,
    status: newstate.status,
    changedAt: newstate.changedAt
  });
  
  return {
    type: 'CAMERA_STATE_TOGGLED',
    payload: newstate
  };
}

/**
* Generate actions for changes in cameras state
*/
function camsChanged(data) {
  let payload = { 
    cam: data.key,
    newval: data.val()
  };
  
  return { type: 'CAMERA_STATE_CHANGED', payload };
}

/**
* Get preferences from browser
*/
export function getPrefs() {
  return {
    type: 'BROWSER_PREFS',
    payload: {
      role: parseInt(localStorage.getItem('mc_role'), 10) || 0,
      lang: localStorage.getItem('mc_lang') || 'eng'
    }
  };
}