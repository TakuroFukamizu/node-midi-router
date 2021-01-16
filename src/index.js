
const Controller = require('./controller');
const StatusLed = require('./statusLed');

const controller = new Controller();
const statusLed = new StatusLed();

//----

// Status LED
controller.on('noteon', (params) => statusLed.midiNoteOn());

setInterval(() => { 
    controller.updateDevices();
}, 1000);

