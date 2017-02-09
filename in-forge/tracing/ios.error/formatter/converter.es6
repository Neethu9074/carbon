import {parse} from './parsers';

/**
 * Converts an input JSON report to an Apple style crash
 * report using the internal parses in sequence.
 *
 * @param report the JSON report.
 * @returns {string} an Apple style report.
 */

export function convert(report) {
  return []
    .concat(
      parse('headers', report),
      parse('reason',  report),
      parse('threads', report),
      parse('cpu',     report),
      parse('images',  report),
      parse('extras',  report)
    )
    .join('\n');
}
