
const easymidi = require('easymidi');
const EventEmitter = require("events");

const emitter = new EventEmitter();
let inputs = [];
let outputs = [];

const kinds = ['noteon', 'noteoff'];

function getDevices() { 
    const inputNames = easymidi.getInputs();
    const outputNames = easymidi.getOutputs();
    // FIXME: 差分チェック
    inputs = inputNames.map((v) => new easymidi.Input(v));
    outputs = outputNames.map((v) => new easymidi.Output(v));
}

function setupListeners() { 
    for (const kind of kinds) {
        for (const input of inputs) { 
            // console.log(input.eventNames());
            input.on(kind, (params) => {
                // params = {note: ..., velocity: ..., channel: ...}
                emitter.emit(kind, params);
                console.log(input.name, kind, params);
            }); 
        }
        emitter.on(kind, (params) => { 
            for (const output of outputs) {
                output.send(kind, params);
            }
        });
    }
}

//----

getDevices();
console.debug(inputs.map((v) => v.name), outputs.map((v) => v.name));

setupListeners();
