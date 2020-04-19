(() => {
  // ==== Constants ====
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

    changeTempo(newTempo) {
      this.tempo = newTempo;
    }

    changeSequence(newPattern) {
      this.activeStepIds = newPattern;
      // clear dots
      Array.from(this.stepElements).forEach(item => item.innerHTML = '');
      // re-populate dots
      this.populateSteps();
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

  // ===============
  const presetSeqs = [
    {
      kick: [0, 4, 8, 12],
      snare: [4, 12],
      openHat: [2, 6, 10, 14],
      closedHat: [0, 4, 8, 12]
    },
    {
      kick: [0, 10],
      snare: [4, 12],
      openHat: [0, 2, 4, 5, 8, 9, 10, 11, 13],
      closedHat: [7, 15]
    },
    {
      kick: [0, 3, 7, 8, 10, 15],
      snare: [4, 11],
      openHat: [0, 2, 4, 6, 8, 10, 12, 14],
      closedHat: [0, 4, 8, 12]
    }
  ];

  // ==== DOM Elements ====
  const stopBtn = document.querySelector('.stop.btn');
  const playBtn = document.querySelector('.play.btn');
  const tempoInput = document.querySelector('.tempo-input');
  const sequenceDropdown = document.querySelector('.sequence');

  // ==== State ====
  let tempo = tempoInput.value;
  let activeDropdownId = sequenceDropdown.value;

  // ==== Components ====
  const sequencers = {
    timer: new Timer(TYPES.TIMER, tempo),
    kick: new StepSequencer(TYPES.KICK, tempo, presetSeqs[activeDropdownId].kick),
    snare: new StepSequencer(TYPES.SNARE, tempo, presetSeqs[activeDropdownId].snare),
    openHat: new StepSequencer(TYPES.OPEN_HAT, tempo, presetSeqs[activeDropdownId].openHat),
    closedHat: new StepSequencer(TYPES.CLOSED_HAT, tempo, presetSeqs[activeDropdownId].closedHat)
  };

  // ==== Event Handlers ====
  function onStart() {
    tempoInput.disabled = true;

    for (key in sequencers) {
      let seq = sequencers[key];
      seq.changeTempo(tempo);
      seq.startTempoAnimation();
    }
  }

  function onStop() {
    tempoInput.disabled = false;

    for (key in sequencers) {
      sequencers[key].stopTempoAnimation();
    }
  }

  function onSeqDropdownChange(e) {
    activeDropdownId = e.target.value;

    for (key in sequencers) {
      let seq = sequencers[key];
      if (key !== TYPES.TIMER) seq.changeSequence(presetSeqs[activeDropdownId][key]);
    }
  }

  // ==== Adding Event Listeners ====
  stopBtn.addEventListener('click', onStop.bind(this));
  playBtn.addEventListener('click', onStart.bind(this));
  tempoInput.addEventListener('change', e => tempo = e.target.value);
  sequenceDropdown.addEventListener('change', e => onSeqDropdownChange(e));
})()
