import TerminalObserver from '../TerminalObserver';
import { reportUnhandledError } from '../unhandledErrorSink';

export default function subscribe(onData, onError, arg0, arg1, arg2, arg3, arg4, arg5) {
  const observer = Object.create(TerminalObserver);

  const internalOnError =
    onError == null
      ? null
      : error => {
          try {
            onError(error, arg0, arg1, arg2, arg3, arg4, arg5);
          } catch (e) {
            reportUnhandledError(e);
          }
        };

  observer._init(
    this,
    data => {
      try {
        onData(data, arg0, arg1, arg2, arg3, arg4, arg5);
      } catch (e) {
        reportUnhandledError(e);
      }
    },
    internalOnError
  );
  return observer;
}
