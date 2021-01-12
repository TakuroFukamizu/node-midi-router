
var easymidi = require('easymidi');

function getDevices() { 
    const outputs = easymidi.getOutputs();
    return outputs;
}

class MidiInterfaceDriver { 
    constructor(name) { 
        if (!name) { 
            this.isDummyMode = true;
            return;
        }
        this.interface = new easymidi.Output(name);
    }
    output(kind, payload) { 
        if (this.isDummyMode) { 
            console.info(`[DUMMY MODE] skip ${kind}`, payload);
            return;
        }
        this.interface.send(kind.toLowerCase(), payload);
        // output.send('noteon', {
        //   note: 64,
        //   velocity: 127,
        //   channel: 3
        // });
    }
}

console.debug(getDevices());
