/**
* Multicam tally application - Language text component
* 
* Yes, i've deside to try to implement localization as React component too
* (spoiler: it's was a bad idea)
* @author eduard.genzora
*/
import { Component } from 'react';
import texts from './i18n';

class LangText extends Component {
  constructor(props) {
    super(props);
    this.state = { out: texts[props.str][props.lang] || props.str }
  }
 
  render() {
    return this.state.out;
  }  
    
}

export default LangText;