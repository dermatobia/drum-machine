const TYPES = {
  KICK: 'kick',
  SNARE: 'snare',
  OPEN_HAT: 'open-hat',
  CLOSED_HAT: 'closed-hat'
}

const MAP_DISPLAY = {
  // activeDot: '&#8226;',
  timer: '&nbsp;',
  [TYPES.KICK]: 'Kick',
  [TYPES.SNARE]: 'Snare',
  [TYPES.OPEN_HAT]: 'Open Hat',
  [TYPES.CLOSED_HAT]: 'Closed Hat'
};

class SoundType {
  constructor(type) {
    this.type = type;
    this.tempo = 60;

    // DOM Elements
    this.stepTemplate = document.getElementById('steps-template');
    this.stepWrapper = document.querySelector(`.step-wrapper.${this.type}`);

    this.mountElement();
  }

  mountElement() {
    this.stepWrapper.appendChild(this.stepTemplate.content.cloneNode(true));
    this.stepWrapper.firstElementChild.innerText = MAP_DISPLAY[this.type];
  }
}

let kick = new SoundType(TYPES.KICK);
let snare = new SoundType(TYPES.SNARE);
let openHat = new SoundType(TYPES.OPEN_HAT);
let closedHat = new SoundType(TYPES.CLOSED_HAT);
