const TYPES = {
  TIMER: 'timer',
  KICK: 'kick',
  SNARE: 'snare',
  OPEN_HAT: 'open-hat',
  CLOSED_HAT: 'closed-hat'
}

const MAP_DISPLAY = {
  [TYPES.TIMER]: '&nbsp;',
  [TYPES.KICK]: 'Kick',
  [TYPES.SNARE]: 'Snare',
  [TYPES.OPEN_HAT]: 'Open Hat',
  [TYPES.CLOSED_HAT]: 'Closed Hat'
};

class StepSequencer {
  constructor(type, activeStepIds = []) {
    this.type = type;
    this.activeStepIds = activeStepIds;
    this.tempo = 60;
    this.intervalId = null;

    // DOM Elements
    this.stepTemplate = document.getElementById('steps-template');
    this.stepWrapper = document.querySelector(`.step-wrapper.${this.type}`);
    this.stepElements = [];

    this.mountElements();
  }

  mountElements() {
    let dotHtmlCode = '&#8226;';

    // Append template clone to parent container and add title.
    this.stepWrapper.appendChild(this.stepTemplate.content.cloneNode(true));
    this.stepWrapper.firstElementChild.innerHTML = MAP_DISPLAY[this.type];
    this.stepElements = this.stepWrapper.querySelectorAll('.step');

    if (this.type !== TYPES.TIMER) {
      this.activeStepIds.forEach(id => this.stepElements[id].innerHTML = dotHtmlCode);
    } else {
      Array.from(this.stepElements).forEach((item, index) => {
        item.innerText = index + 1;
        item.classList.remove('box');
      });
    }
  }

  startTempoAnimation() {
    // don't do anything if there is existing animation in progress
    if (this.intervalId) return;

    let indexCounter = 0;
    const stepInterval = 60/this.tempo*4/8*1000;  // in milliseconds
    const stepsLength = this.stepElements.length;        // 16 in this case

    this.intervalId = setInterval(() => {
      const currIndex = indexCounter % stepsLength;
      let prevIndex = (indexCounter - 1) % stepsLength;
      // For edge case when the index counter goes back to beginning,
      // we still need to clear the last box item in the collection
      prevIndex = prevIndex > -1 ? prevIndex : stepsLength - 1;

      // highlight and clear highlight step boxes
      this.stepElements[currIndex].classList.add('highlight');
      this.stepElements[prevIndex].classList.remove('highlight');

      // increment index counter
      indexCounter = (indexCounter + 1) % stepsLength;
    }, stepInterval);
  }

  stopTempoAnimation() {
    clearInterval(this.intervalId);
    this.intervalId = null;

    Array.from(this.stepElements).forEach(item => item.classList.remove('highlight'));
  }
}

let arr0 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
let arr1 = [1, 3, 5, 7, 9, 11, 13, 15];
let arr2 = [0, 2, 4, 6, 8, 10, 12, 14];
let arr3 = [3, 7, 11, 15];

let timer = new StepSequencer(TYPES.TIMER);
let kick = new StepSequencer(TYPES.KICK, arr1);
let snare = new StepSequencer(TYPES.SNARE, arr2);
let openHat = new StepSequencer(TYPES.OPEN_HAT, arr3);
let closedHat = new StepSequencer(TYPES.CLOSED_HAT, arr0);

let stopBtn = document.querySelector('.stop.btn');
let playBtn = document.querySelector('.play.btn');

function start() {
  timer.startTempoAnimation();
  kick.startTempoAnimation();
  snare.startTempoAnimation();
  openHat.startTempoAnimation();
  closedHat.startTempoAnimation();
}

function stop() {
  timer.stopTempoAnimation();
  kick.stopTempoAnimation();
  snare.stopTempoAnimation();
  openHat.stopTempoAnimation();
  closedHat.stopTempoAnimation();
}

stopBtn.addEventListener('click', (e) => {
  console.log('stop btn click', e);
  stop();
})

playBtn.addEventListener('click', (e) => {
  console.log('play btn click', e);
  start();
})
