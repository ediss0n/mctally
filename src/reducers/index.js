/**
* Main application reducer
* 
* @author eduard.genzora
*/

const initialState = {
    session: null, 
    role: 1,
    lang: 'eng',
    cams: {  
      cam1: {shot: 0, status: 0, changedAt: Date.now()},
      cam2: {shot: 0, status: 0, changedAt: Date.now()},
      cam3: {shot: 0, status: 0, changedAt: Date.now()}
    }
};

function main_reducer(state = initialState, action) {
  switch(action.type) {
    case 'SUBMIT_LOGIN':
      return {
        ...state,
        role: action.logdata.role,
        lang: action.logdata.lang
      };
    case 'BROWSER_PREFS':
    case 'AUTHORIZED':  
      return {
        ...state,
        ...action.payload
      };  
    case 'CAMERA_STATE_CHANGED':
      return {
        ...state,
        cams: cams(state.cams, action.payload)
      };
    case 'LOGOUT':
      return {
        ...state,
        session: null,
        session_ref: null
      };
    default:
      return state;
  }
}

function cams(state, action) {
  return {
    ...state,
    [action.cam] : action.newval
  };
}

export default main_reducer;