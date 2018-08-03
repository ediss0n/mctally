/**
* Interact with "outer world" 
* 
* @author eduard.genzora
*/

// Adding Google tools
import firebase from '../Firebase';

/**
* Lets stat with only 3 cameras (maybe extend it later)
*/
function storeTemplate(db) {
  db.set({
    cams: {
      cam1: {shot: 0, status: 0, changedAt: Date.now()},
      cam2: {shot: 0, status: 0, changedAt: Date.now()},
      cam3: {shot: 0, status: 0, changedAt: Date.now()}
    }
  });
}

/**
* Create new user
* TODO: error processing
*/  
function createSession(data) {
  firebase.auth().createUserWithEmailAndPassword(data.email, data.pass)
    .catch(function(error) {
      console.log(error);
    });    
}

/**
* Login existing
* TODO: error processing  
*/  
function enterSession(data) {
  firebase.auth().signInWithEmailAndPassword(data.email, data.pass)
    .catch(function(error) {
      console.log(error);
    });    
}

/**
* Logout
* TODO: error processing  
*/  
function leaveSession() {
  firebase.auth().signOut()
    .catch(function(error) {
      console.log(error);
    });
}

export { storeTemplate, createSession, enterSession, leaveSession };