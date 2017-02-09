import {pad_left, pad_hex, pad_right, get_crash_thread} from '../util';
import {get_cpu_arch, get_cpu_type, get_registers} from '../cpu';

/**
 * Parses out the CPU registers dump from the crash. This is
 * reused internally and so you can pass a custom thread to
 * work against as needed.
 *
 * @param report the JSON crash report.
 * @param [thread] an optional thread object.
 * @returns {string[]} an array of output.
 */
export function parseCpu(report, thread) {
  var rows = [''];
  var crashed = thread || get_crash_thread(report);

  if (!crashed) {
    return rows;
  }

  var index = crashed['index'];
  var sys   = report['system'] || {};
  var type  = sys['binary_cpu_type'];
  var sub   = sys['binary_cpu_subtype'];

  var arch;
  if (!type && !sub) {
    arch = sys['cpu_arch'];
  } else {
    arch = get_cpu_arch(type, sub);
  }

  var cpu = get_cpu_type(arch);

  rows.push(`Thread ${index} crashed with ${cpu} Thread State:`);

  var registers = (crashed['registers'] || {})['basic'] || {};
  var reg_order = get_registers(cpu);

  var line = '';

  for (var i = 0, j = reg_order.length; i < j; i++) {
    if (i % 4 === 0 && i !== 0) {
      rows.push(line);
      line = '';
    }

    var register      = reg_order[i];
    var register_addr = registers[register] || 0;
    var register_name = pad_left(register, ' ', 6);
    var register_loc  = pad_hex(register_addr, '0', 8);
    var register_pad  = pad_right(register_loc, ' ', 9);

    line += `${register_name}: 0x${register_pad}`;
  }

  if (line) {
    rows.push(line);
  }

  return rows;
}
