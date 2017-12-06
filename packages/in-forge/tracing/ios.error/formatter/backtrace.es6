import { pad_right, pad_hex, to_hex } from './util';
/**
 * Traces down a thread to provide a backtrace of actions.
 * This will output memory addresses and method names (if
 * available).
 *
 * @param backtrace the thread to go down.
 * @returns {Array} an array of output.
 */
export function parse_backtrace(backtrace) {
  if (!backtrace) {
    return [];
  }

  var num = 0;
  var rows = [];
  var contents = backtrace['contents'] || [];

  contents.forEach(function(trace) {
    // addresses
    var ist_addr = trace['instruction_addr'] || 0;
    var obj_addr = trace['object_addr'] || 0;
    var sym_addr = trace['symbol_addr'] || 0;

    // names
    var obj_name = trace['object_name'];
    var sym_name = trace['symbol_name'];

    // padded fields
    var padded_num = pad_right(num++, ' ', 3);
    var padded_name = pad_right(obj_name, ' ', 31);
    var padded_addr = pad_hex(ist_addr, '0', 8);

    // output fields
    var preamble = `${padded_num} ${padded_name} 0x${padded_addr}`;
    var unparsed = `0x${to_hex(obj_addr)} + ${ist_addr - obj_addr}`;

    // output without symbols
    var base_output = `${preamble} ${unparsed}`;

    // adding symbols
    if (sym_name && sym_name !== '<redacted>') {
      base_output += ` (${sym_name} + ${ist_addr - sym_addr})`;
    }

    // pushing output
    rows.push(base_output);
  });

  return rows;
}
