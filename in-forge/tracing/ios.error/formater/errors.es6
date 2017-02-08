import {pad_hex, header} from './util';

/**
 * Parses out the exception section of a Crash report.
 *
 * @param error the error object to deal with.
 * @param thread the crashed thread.
 * @returns {*[]} an array of output.
 */
export function parse_errors(error, thread) {
  var signal = error['signal'];
  var mach   = error['mach'];

  var exc_name  = mach['exception_name'] || '0';
  var code_name = mach['code_name'] || '0x00000000';
  var sig_name  = signal['name'] || signal['signal'] || '0';
  var addr_name = pad_hex(error['address'] || 0, '0', 8);

  var index  = 0;

  if (thread) {
    index = thread['index'];
  }

  return [
    header('Exception Type:'     , `${exc_name} (${sig_name})`),
    header('Exception Codes:'    , `${code_name} at 0x${addr_name}`),
    header('Crashed Thread:'     , index)
  ];
}
