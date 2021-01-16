require('dotenv').config();

const defines = {
    PinAssings: {
        MidiNoteOnLED: 16 // P16 / GPIO23
    },
    IgnoreMidiDevices: {
        Prefix: [
            'Midi Through:Midi Through Port-',
            'RtMidi Output Client:RtMidi Output',
            'RtMidi Input Client:RtMidi Input'
        ]
    },
    IsGpioDisabledMode: process.env.IS_GPIO_DISABLED_MODE
};

module.exports = defines;
