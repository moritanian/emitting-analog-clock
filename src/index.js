function createAnalogClock(option = {}) {

  option = Object.assign({
    size: 600,
    id: 'analog-clock',
    shadowing: true,
    showDigital: false,
    visibleSecondHand: true,
    smooth: false,
    date: null,
    dateFunc: (now) => now,
    nextFunc: (date) => ((1500 - date.getMilliseconds()) % 1000) + 500,
    color: '#28d1fa',
    backgroundColor: '#09303aff',
    backgroundImage: null
  }, option);

  var parent = document.getElementById(option.id);
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.width = option.size + 'px';
  wrapper.style.height = option.size + 'px';
  parent.appendChild(wrapper);

  var canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.margin = '0';
  wrapper.appendChild(canvas);
  canvas.setAttribute('width', option.size);
  canvas.setAttribute('height', option.size);
  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = option.color;

  ctx.lineWidth = 17;
  ctx.lineCap = 'round';
  if (option.shadowing) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = option.color;
  }
  

  const centerX = option.size/2;
  const centerY = option.size/2;
  const maxRadius = option.size / 2;

   // Background
   const r0 = 5;
   const r1 = option.size/4*3;
   // ctx.globalAlpha = 0.1;
   const gradient = ctx.createRadialGradient(centerX, centerY ,r0, centerX, centerY, r1);
   gradient.addColorStop(0, option.backgroundColor);
   gradient.addColorStop(1, '#000000ff');

  // background image
  var backgroundImage = null
  if (option.backgroundImage) {
    backgroundImage = new Image();
    backgroundImage.src = option.backgroundImage;
  }
 
  
  function degToRad(degree) {
    var factor = Math.PI/180;
    return degree*factor;
  }

  function renderTime(date) {
  
    var today = date.toDateString();
    var time = date.toLocaleTimeString();
    var milliseconds = date.getMilliseconds();
    var seconds = date.getSeconds();
    var newSeconds = seconds + (milliseconds/1000);
    if (!option.smooth) {
      newSeconds = Math.round(newSeconds);
    }
    var minutes = date.getMinutes() + newSeconds / 60;
    var hours = date.getHours() + minutes / 60;

    // Background
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0, option.size, option.size);

    // background image
    if (option.backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, option.size, option.size);   
    }
    
    // Hours
    const hoursRad = degToRad((hours*30)-90);
    const hoursRadius =  maxRadius * 0.5;
    drawClockHand(hoursRad, hoursRadius, option.size / 300 * 7);
    ctx.stroke();
    
    // Minutes
    const minutesRad = degToRad((minutes*6)-90);
    const minutesRadius = maxRadius * 0.8;
    drawClockHand(minutesRad, minutesRadius, option.size / 300 * 10);
   
    // seconds
    if (option.visibleSecondHand) {
      const secondRad = degToRad((newSeconds*6)-90);
      const secondRadius =  maxRadius * 0.7;
      drawClockHand(secondRad, secondRadius, option.size / 300 * 3);
    }

    if(option.showDigital) {
      const fontSize1 = Math.max(12, option.size / 30);
      const fontSize2 = Math.max(11, option.size / 40);
      // Date 
      ctx.font = `${fontSize1}px Helvetica`;
      ctx.fillStyle = option.color;
      ctx.fillText(today, centerX - centerX * 0.4, centerY * 2 - fontSize1 - fontSize2 - 20);
      
      // Time
      ctx.font = `${fontSize2}px Helvetica`;
      ctx.fillText(time, centerX - centerX * 0.4, centerY * 2 - fontSize2 - 20);
    }
  
    function drawClockHand (radian, radius, width) {
      const cosX = Math.cos(radian);
      const cosY = Math.sin(radian);
      const shift = 0.1;
      ctx.beginPath();
  
      ctx.lineWidth = width;
      ctx.moveTo(centerX - cosX * radius * shift, centerY - cosY * radius * shift);
      ctx.lineTo(centerX +cosX * radius, centerY + cosY * radius);
      ctx.stroke();
  
    }
  }

  function parseDate(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    if(!(date instanceof Date) || date.toString() === "Invalid Date") {
      throw new TypeError('option.date is invalid format.');
    }

    return date;
  }

  // dials
  function createDials() {
    const dialsCanvas = document.createElement('canvas');
    dialsCanvas.style.position = 'absolute';
    dialsCanvas.style.top = '0';
    dialsCanvas.style.left = '0';
    dialsCanvas.style.margin = '0';

    wrapper.appendChild(dialsCanvas);

    dialsCanvas.setAttribute('width', option.size);
    dialsCanvas.setAttribute('height', option.size);
    var dialsCtx = dialsCanvas.getContext('2d');

    dialsCtx.strokeStyle = option.color;
    dialsCtx.lineWidth = 2;
    // dialsCtx.lineCap = 'round';
    // dialsCtx.shadowBlur = 15;
    // dialsCtx.shadowColor = '#28d1fa';

    const radius = option.size / 2 - 10.0;
    const length = option.size / 30;

    for(var radian = 0; radian < Math.PI * 2; radian += Math.PI * 2/12) {
      drawDial(radian);
    }

    function drawDial(radian){
      
      const cosX = Math.cos(radian);
      const cosY = Math.sin(radian);
      dialsCtx.beginPath();
      dialsCtx.moveTo(centerX + cosX * radius, centerY + cosY * radius);
      dialsCtx.lineTo(centerX + cosX * (radius - length), centerY + cosY * (radius - length));
      dialsCtx.stroke();

    }
  }

  function animate () {
    var date = option.dateFunc(new Date());
    date = parseDate(date);
  
    if (option.smooth) {
      requestAnimationFrame(animate);
    } else {
      var next = option.nextFunc(date);
      setTimeout(animate, next);
    }

    renderTime(date);
  }

  createDials();

  if(option.date){ // fixed clock
    var date = parseDate(option.date);
    renderTime(date);
  } else { // moving clock
    animate()
  }
}

export default createAnalogClock;
