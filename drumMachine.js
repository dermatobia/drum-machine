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
    this.tempo = 128;
    this.intervalId = null;

    // DOM Elements
    this.stepTemplate = document.getElementById('steps-template');
    this.stepWrapper = document.querySelector(`.step-wrapper.${this.type}`);
    this.steps = [];

    this.mountElements();
  }

  mountElements() {
    // Append template clone to parent container and add title.
    this.stepWrapper.appendChild(this.stepTemplate.content.cloneNode(true));
    this.stepWrapper.firstElementChild.innerText = MAP_DISPLAY[this.type];
    this.steps = this.stepWrapper.querySelectorAll('.step');
  }

  startTempoAnimation() {
    // don't do anything if there is existing animation in progress
    if (this.intervalId) return;

    let indexCounter = 0;
    const stepInterval = 60/this.tempo*4/8*1000;  // in milliseconds
    const stepsLength = this.steps.length;        // 16 in this case

    this.intervalId = setInterval(() => {
      const currIndex = indexCounter % stepsLength;
      let prevIndex = (indexCounter - 1) % stepsLength;
      // For edge case when the index counter goes back to beginning,
      // we still need to clear the last box item in the collection
      prevIndex = prevIndex > -1 ? prevIndex : stepsLength - 1;

      // highlight and clear highlight step boxes
      this.steps[currIndex].classList.add('active');
      this.steps[prevIndex].classList.remove('active');

      // increment index counter
      indexCounter = (indexCounter + 1) % stepsLength;
    }, stepInterval);
  }

  stopTempoAnimation() {
    clearInterval(this.intervalId);

    Array.from(this.steps).forEach(item => item.classList.remove('active'));
  }
}

let kick = new SoundType(TYPES.KICK);
let snare = new SoundType(TYPES.SNARE);
let openHat = new SoundType(TYPES.OPEN_HAT);
let closedHat = new SoundType(TYPES.CLOSED_HAT);

let stopBtn = document.querySelector('.stop.btn');
let playBtn = document.querySelector('.play.btn');

function start() {
  kick.startTempoAnimation();
  openHat.startTempoAnimation();
}

function stop() {
  kick.stopTempoAnimation();
  openHat.stopTempoAnimation();
}

stopBtn.addEventListener('click', (e) => {
  console.log('stop btn click', e);
  stop();
})

playBtn.addEventListener('click', (e) => {
  console.log('play btn click', e);
  start();
})
