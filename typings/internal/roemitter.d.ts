declare module 'roemitter' {
  import {Observable} from 'reactive-observables';

  export class RoEmitter {
    constructor(name: string);

    emit(eventName: string, payload?: any): void;

    on(eventName: string): Observable<any>;
  }
}
