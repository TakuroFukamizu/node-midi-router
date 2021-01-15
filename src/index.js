
const easymidi = require('easymidi');
const EventEmitter = require("events");
const StatusLed = require('./statusLed');

const statusLed = new StatusLed();

const emitter = new EventEmitter();
let inputs = [];
let outputs = [];

const kinds = [
    'noteon', 'noteoff',
    'poly aftertouch', 'cc', 'program', 'channel aftertouch', 'pitch', 'position', 'mtc', 'select',
    'clock', 'start', 'continue', 'stop', 'activesense', 'reset', 'sysex'
];

function getDevices() { 
    const inputNames = easymidi.getInputs();
    const outputNames = easymidi.getOutputs();

    // 差分チェック
    const newValue = inputNames.join('') + outputNames.join('');
    const oldValue = inputs.map(v => v.name).join('') + outputs.map(v => v.name).join('');
    if (newValue == oldValue) { 
        return; // 更新不要
    }

    // 使用中のデバイスはcloseする
    // MidiOutWinMM::openPort: error creating Windows MM MIDI output port.
    outputs.forEach((v) => v.close());
    inputs.forEach((v) => v.close());

    // デバイス更新
    inputs = inputNames.map((v) => new easymidi.Input(v));
    outputs = outputNames.map((v) => new easymidi.Output(v));
    console.debug('update devices', inputs.map((v) => v.name), outputs.map((v) => v.name));

    // Input->Outputとなるようにeventbusをセット
    for (const kind of kinds) {
        for (const input of inputs) { 
            // console.log(input.eventNames());
            input.on(kind, (params) => {
                // params = {note: ..., velocity: ..., channel: ...}
                emitter.emit(kind, params);
                console.log(input.name, kind, params);
            }); 
        }
        emitter.removeAllListeners(kind);
        emitter.on(kind, (params) => { 
            for (const output of outputs) {
                output.send(kind, params);
            }
        });
    }
}

//----

emitter.on('noteon', () => { 
    statusLed.midiNoteOn();
});

getDevices();
console.debug(inputs.map((v) => v.name), outputs.map((v) => v.name));

// ---

setInterval(() => { 
    getDevices();
}, 1000);

