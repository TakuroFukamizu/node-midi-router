
const defines = {
    PinAssings: {
        MidiNoteOnLED: 16 // P16 / GPIO23
    },
    IgnoreMidiDevices: {
        Prefix: [
            'Midi Through:Midi Through Port-',
            'RtMidi Output Client:RtMidi Output',
            'RtMidi Input Client:RtMidi Input',
            'USB MIDI Interface:USB MIDI Interface MIDI'
        ]
    }
};

module.exports = defines;
