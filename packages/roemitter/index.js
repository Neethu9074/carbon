import { create } from 'reactive-observables';
import { createLogger } from 'instalog';

export default class RoEmitter {
  constructor(name) {
    this._name = name || 'anonymous';
    this._logger = createLogger('rxemitter:' + this._name);
    this._subjects = {};
  }

  emit(name, data) {
    var fnName = createName(name);
    var subject = this._subjects[fnName];
    if (!subject) {
      subject = this._subjects[fnName] = create();
    }
    this._logger.trace('Emitting event', name, 'with data', data);
    subject.emit(data);
  }

  on(name) {
    var fnName = createName(name);
    var subject = this._subjects[fnName];
    if (!subject) {
      subject = this._subjects[fnName] = create();
    }
    return subject;
  }

  dispose() {
    this._subjects = {};
  }
}

function createName(name) {
  return '$' + name;
}
