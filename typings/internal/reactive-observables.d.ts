declare module 'reactive-observables' {

  export interface Disposable {
    dispose(): void;
  }

  export interface Observable<T> {
    subscribe(subscriber: (value: T) => any): Disposable;
    once(subscriber: (value: T) => any): Disposable;
    map<V>(mapper: (value: T) => V): Observable<V>;
    async(): Observable<T>;
    nextFrame(): Observable<T>;
    filter(predicate: (predicate: any) => boolean): Observable<T>;
    scan<V>(scanner: (aggregate:V, value:T) => V, initialValue?: V): Observable<V>;
  }

  export interface RootObservable<T> extends Observable<T> {
    emit(value: T): void;
  }

  export function create(parameter: any) : {
    emit(params: Object) : any;
  }
}
