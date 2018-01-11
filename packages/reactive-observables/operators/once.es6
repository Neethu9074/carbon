// @flow
import TerminalObserver from '../TerminalObserver';
import { reportUnhandledError } from '../unhandledErrorSink';

/**
 * A one-off subscription. Like subscribe(), but disposes automatically after the first time data has been received.
 */
export default function once<C>(
  onData: Function,
  onError: Function,
  arg0: any,
  arg1: any,
  arg2: any,
  arg3: any,
  arg4: any,
  arg5: any
): TerminalObserver<C> {
  const observer: TerminalObserver<C> = new TerminalObserver(this);

  const internalOnNext = (data: ?C) => {
    observer.dispose();
    try {
      onData(data, arg0, arg1, arg2, arg3, arg4, arg5);
    } catch (e) {
      reportUnhandledError(e);
    }
  };
  const internalOnError =
    onError == null
      ? null
      : error => {
          observer.dispose();

          try {
            onError(error, arg0, arg1, arg2, arg3, arg4, arg5);
          } catch (e) {
            reportUnhandledError(e);
          }
        };

  return observer._init(internalOnNext, internalOnError);
}
