declare module 'instalog' {

  export interface Logger {
    debug(...msg: any[]) : void;
    error(...msg: any[]) : void;
    trace(...msg: any[]) : void;
    info(...msg: any[]) : void;
    warn(...msg: any[]) : void;
  }

  export function createLogger(name: string) : Logger;
}
