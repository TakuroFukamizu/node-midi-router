
const easymidi = require('easymidi');
const EventEmitter = require("events");
const defines = require('./defines');

const kinds = [
    'noteon', 'noteoff',
    'poly aftertouch', 'cc', 'program', 'channel aftertouch', 'pitch', 'position', 'mtc', 'select',
    'clock', 'start', 'continue', 'stop', 'activesense', 'reset', 'sysex'
];

class Controller extends EventEmitter { 

    constructor() { 
        super();
        this.inputs = [];
        this.outputs = [];

        // Outputのイベントは共通
        for (const kind of kinds) {
            this.on(kind, (params) => { 
                this.outputMessageEventHandler(kind, params);
            });
        }
    }

    updateDevices() { 
        const { inputNames, outputNames } = this.getDeviceUpdates();
        if (inputNames.length == 0 && outputNames.length == 0) { 
            return false;
        }
    
        // デバイス更新
        console.debug('update devices', inputNames, outputNames);
    
        // Inputの準備
        for (const name of inputNames) {
            const input = new easymidi.Input(name);
            for (const kind of kinds) {
                input.on(kind, (params) => {
                    // params = {note: ..., velocity: ..., channel: ...}
                    this.emit(kind, params);
                    console.log(input.name, kind, params);
                });
            }
            this.inputs.push(input);
        }

        // Outputの準備
        for (const name of outputNames) { 
            this.outputs.push(new easymidi.Output(name));
        }

        return true;
    }

    getDeviceUpdates() { 
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
    
        // 既存リストに無いものだけにする
        inputNames = inputNames.filter((v) => { 
            for (const input of this.inputs) { 
                if (input.name == v) { 
                    return false;
                }
            }
            return true;
        });
        outputNames = outputNames.filter((v) => { 
            for (const output of this.outputs) { 
                if (output.name == v) { 
                    return false;
                }
            }
            return true;
        });
        // TODO: 無くなったデバイスの削除
    
        return {
            inputNames,
            outputNames
        };
    }

    outputMessageEventHandler(kind, params) { 
        // switch (kind) { 
        //     case 'noteon': statusLed.midiNoteOn(); break;
        // }
        for (const output of this.outputs) {
            output.send(kind, params);
        }
    }
    
}

module.exports = Controller;