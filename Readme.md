emitting-analog-clock
========

[![npm version](https://badge.fury.io/js/emitting-analog-clock.svg)](https://badge.fury.io/js/emitting-analog-clock)

#### javascript emitting analog clock library ####

<a href="https://moritanian.github.io/emitting-analog-clock"><img src="https://moritanian.github.io/emitting-analog-clock/sample.png"/></a>


<p align="center"><a href="https://moritanian.github.io/emitting-analog-clock">DEMO</a></p>

## Usage
```index.js
// Fixed clock
createAnalogClock({
  id: 'clock1',
  size: 300,
  date: 'December 17, 1995 10:10:23'
});

// Clock with custom colors
createAnalogClock({
  id: 'clock2',
  size: 200,
  color: '#d2d2aa',
  visibleSecondHand: false,
  backgroundColor: '#303011'
});

// Smooth moving clock with digital display 
(function createClock3(){
  var runnning = true;
  var lastTime = null;
  var clock3Button = document.getElementById('clock3-button');
  clock3Button.addEventListener('click', () => {
    runnning = !runnning;
  });
  createAnalogClock({
    id: 'clock3',
    size: 170,
    smooth: true,
    showDigital: true,
    dateFunc: (now) => {
      if (runnning) {
        lastTime = now;
        return now;
      } else {
        return lastTime;
      }
    }
  });
})();

// Reverse clock
createAnalogClock({
  id: 'clock4',
  size: 240,
  dateFunc: (now) => - now.getTime(),
  smooth: true,
  showDigital: true,
  color: '#dd22dd',
  backgroundColor: '#000000'
});


// fast clock
createAnalogClock({
  id: 'clock6',
  size: 250,
  dateFunc: (now) => now.getTime() * 4,
  nextFunc: (date) => 250,
  showDigital: true,
  
});

// Clock with custom background image
createAnalogClock({
  id: 'clock5',
  size: 250,
  //shadowing: false,
  color: '#ffffff',
  backgroundImage: 'https://images.pexels.com/photos/1095601/pexels-photo-1095601.jpeg'
});
```
