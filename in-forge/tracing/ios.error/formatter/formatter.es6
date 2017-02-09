import {convert} from './converter';

/**
 * Converts a JSON crash report to Apple format.
 *
 * @param json the JSON object.
 * @returns {string} an Apple crash report.
 */
export function convert_json(json) {
  return convert(json);
}
