const rpio = require('rpio');
const defines = require('./defines');

class StatusLed { 
    constructor() { 
        rpio.open(defines.PinAssings.MidiNoteOnLED, rpio.OUTPUT, rpio.LOW);
    }
    
    midiNoteOn() { 
        rpio.write(defines.PinAssings.MidiNoteOnLED, rpio.HIGH);
        rpio.msleep(500);
        rpio.write(defines.PinAssings.MidiNoteOnLED, rpio.LOW);
    }
}

module.exports = StatusLed;
