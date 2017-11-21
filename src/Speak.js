/**
* Multicam tally application - Speech Synth
* 
* Routines for speech synthesis
* Will be used as a shot changing signal
* "Silent" when engine is not supported
* @author eduard.genzora
*/
import texts from './i18n';

class Speak {

  // Initializing once per session
  constructor(lang, cams) {
    // for voice search
    this.lang_codes = {
      'rus': 'ru-RU',
      'eng': 'en-US'
    }
    
    this.lang = lang;
    this.cams = cams;
    
    this.searchVoice = this.searchVoice.bind(this);
    
    // Only if supported
    if ('speechSynthesis' in window) {
      // bug in Chrome so we need to pull it twice
      speechSynthesis.getVoices();
      setTimeout(() => speechSynthesis.onvoiceschanged = this.searchVoice(this.lang_codes[lang]), 1000);
    }
    
    this.say = this.say.bind(this);
    this.build = this.build.bind(this);
  }
  
  say(txt) {
    if ('speechSynthesis' in window) {
      let msg = new SpeechSynthesisUtterance(txt);
      if (this.voice)
        msg.voice = this.voice;
      speechSynthesis.speak(msg);
    }
  }
  
  build(cam_num, shot_num, status, shots) {
    if ('speechSynthesis' in window) {
      let curshot = (status === 0) ? shots[this.lang][shot_num] : texts.changing[this.lang];
      this.say(this.cams[this.lang][cam_num] + ' - ' + curshot);
    }
  }  
  
  searchVoice(lang_code) {
    var reserve = 0;
    var target = 0;
    speechSynthesis.getVoices().forEach(function(voice) {
      if (!reserve && voice.lang === 'en-US') 
        reserve = voice;
      if (!target && voice.lang === lang_code) {
        target = voice;
      }
    });
    // In every bad case - speak English
    if (!target)
      this.lang = 'eng';
    
    this.voice = target || reserve;
  }
}

export default Speak;

