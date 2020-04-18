const TYPES = {
  TIMER: 'timer',
  KICK: 'kick',
  SNARE: 'snare',
  OPEN_HAT: 'open-hat',
  CLOSED_HAT: 'closed-hat'
}

const MAP_DISPLAY_NAME = {
  [TYPES.TIMER]: '&nbsp;',
  [TYPES.KICK]: 'Kick',
  [TYPES.SNARE]: 'Snare',
  [TYPES.OPEN_HAT]: 'Open Hat',
  [TYPES.CLOSED_HAT]: 'Closed Hat'
};

class StepSequencer {
  constructor(type, tempo, activeStepIds = []) {
    this.type = type;
    this.tempo = tempo;
    this.activeStepIds = activeStepIds;
    this.intervalId = null;

    // DOM Elements
    this.stepTemplate = document.getElementById('steps-template');
    this.stepWrapper = document.querySelector(`.step-wrapper.${this.type}`);
    this.stepElements = [];

    // Append template clone to parent container and add title.
    this.stepWrapper.appendChild(this.stepTemplate.content.cloneNode(true));
    this.stepWrapper.firstElementChild.innerHTML = MAP_DISPLAY_NAME[this.type];
    this.stepElements = this.stepWrapper.querySelectorAll('.step');

    this.populateSteps();
  }

  populateSteps() {
    // Populate active step boxes with dots
    let dotHtmlCode = '&#8226;';
    this.activeStepIds.forEach(id => this.stepElements[id].innerHTML = dotHtmlCode);
  }

  startTempoAnimation() {
    // don't do anything if there is existing animation in progress
    if (this.intervalId) return;

    let indexCounter = 0;
    const stepInterval = 60/this.tempo*4/8*1000;  // in milliseconds
    const stepsLength = this.stepElements.length; // 16 in this case

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

// Extend StepSequencer to build Timer
class Timer extends StepSequencer {
  populateSteps() {
    Array.from(this.stepElements).forEach((item, index) => {
      item.innerText = index + 1;   // populate with numbers instead of dots
      item.classList.remove('box'); // unused class for timer
    });
  }
}

let arr0 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
let arr1 = [1, 3, 5, 7, 9, 11, 13, 15];
let arr2 = [0, 2, 4, 6, 8, 10, 12, 14];
let arr3 = [3, 7, 11, 15];
let tempo = 60;

let timer = new Timer(TYPES.TIMER, tempo);
let kick = new StepSequencer(TYPES.KICK, tempo, arr1);
let snare = new StepSequencer(TYPES.SNARE, tempo, arr2);
let openHat = new StepSequencer(TYPES.OPEN_HAT, tempo, arr3);
let closedHat = new StepSequencer(TYPES.CLOSED_HAT, tempo, arr0);

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
