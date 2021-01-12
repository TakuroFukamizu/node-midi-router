
var easymidi = require('easymidi');

const inputs = easymidi.getInputs();
const outputs = easymidi.getOutputs();
console.debug(inputs, outputs);

const inputName = 'nanoKEY2 KEYBOARD';
const outputName = 'USB MIDI Interface';

const input = new easymidi.Input(inputName);
const output = new easymidi.Output(outputName);

const kinds = ['noteon', 'noteoff'];
for (const kind of kinds) {
    input.on(kind, (params) => {
        // params = {note: ..., velocity: ..., channel: ...}
        console.log(kind, params);
        output.send(kind, params);
    }); 
}
