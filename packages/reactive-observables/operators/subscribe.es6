// @flow
import TerminalObserver from '../TerminalObserver';
import { reportUnhandledError } from '../unhandledErrorSink';

export default function subscribe<C>(
  onData: Function,
  onError: ?Function,
  arg0: ?any,
  arg1: ?any,
  arg2: ?any,
  arg3: ?any,
  arg4: ?any,
  arg5: ?any
): TerminalObserver<C> {
  const observer: TerminalObserver<C> = new TerminalObserver(this);

  const internalOnNext = (data: ?C) => {
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
          try {
            if (onError) onError(error, arg0, arg1, arg2, arg3, arg4, arg5);
          } catch (e) {
            reportUnhandledError(e);
          }
        };

  return observer._init(internalOnNext, internalOnError);
}
