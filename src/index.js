
const easymidi = require('easymidi');
const EventEmitter = require("events");
const StatusLed = require('./statusLed');
const defines = require('./defines');

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
    let inputNames = easymidi.getInputs();
    let outputNames = easymidi.getOutputs();

    // 無視するデバイス
    inputNames = inputNames.filter((v) => {
        for (const pattern of defines.IgnoreMidiDevices.Prefix) {
            if (v.indexOf(pattern) === 0) {
                return false;
            }
        }
        return true;
    });
    outputNames = outputNames.filter((v) => {
        for (const pattern of defines.IgnoreMidiDevices.Prefix) {
            if (v.indexOf(pattern) === 0) {
                return false;
            }
        }
        return true;
    });

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
            switch (kind) { 
                case 'noteon': statusLed.midiNoteOn(); break;
            }
            for (const output of outputs) {
                output.send(kind, params);
            }
        });
    }
}

//----

getDevices();
console.debug(inputs.map((v) => v.name), outputs.map((v) => v.name));

// emitter.addListener('noteon', () => { 
//     statusLed.midiNoteOn();
// });
// emitter.removeAllListeners(kind); が邪魔

// ---

setInterval(() => { 
    getDevices();
}, 1000);

