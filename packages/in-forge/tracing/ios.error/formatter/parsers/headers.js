import { get_crash_thread, header } from '../util';
import { parse_errors } from '../errors';
import { get_cpu_type } from '../cpu';

/**
 * Parses out the Utils.headers of a crash report. The  Utils.headers
 * are the bulk of the meta information at the top of a
 * crash report.
 *
 * @param report the JSON crash report.
 * @returns {string[]} an array of Utils.headers.
 */
export function parseHeader(report) {
  var sys = report.system || {};
  var info = report.report || {};

  function _i(x) {
    return info[x] || '';
  }

  function _s(x) {
    return sys[x] || '';
  }

  var error = report['crash']['error'];
  var thread = get_crash_thread(report);

  return [
    header('CrashReporter Key:', _s('device_app_hash'), 4),
    header('Incident Identifier:', _i('id'), 4),
    header('Process:', `${_s('process_name')} [${_s('process_id')}]`),
    header('Hardware Model:', _s('machine'), 4),
    header('Path:', _s('CFBundleExecutablePath')),
    header('Identifier:', _s('CFBundleIdentifier')),
    header('Version:', `${_s('CFBundleShortVersionString')} (${_s('CFBundleVersion')})`),
    header('Code Type:', get_cpu_arch(report)),
    header('Parent Process:', `${_s('parent_process_name')} [${_s('parent_process_id')}]`),
    header('', ''),
    header('Date/Time:', get_time(report)),
    header('OS Version:', `${_s('system_name')} ${_s('system_version')} (${_s('os_version')})`),
    header('Report Version:', 104),
    header('', '')
  ].concat(parse_errors(error, thread));
}

/*
  Private functions.
 */

function get_cpu_arch(report) {
  return get_cpu_type((report['system'] || {})['cpu_arch']);
}

function get_time() {
  return '';
}
