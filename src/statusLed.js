const rpio = require('rpio');
const defines = require('./defines');

class StatusLed { 
    constructor() { 
        if (defines.IsGpioDisabledMode) return;
        rpio.open(defines.PinAssings.MidiNoteOnLED, rpio.OUTPUT, rpio.LOW);
    }

    midiNoteOn() { 
        if (defines.IsGpioDisabledMode) return false;

        rpio.write(defines.PinAssings.MidiNoteOnLED, rpio.HIGH);
        // rpio.msleep(10); //usleep(microseconds);してる
        setTimeout(() => {
            rpio.write(defines.PinAssings.MidiNoteOnLED, rpio.LOW);
        }, 100);
    }
}

module.exports = StatusLed;
