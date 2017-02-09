import {parseCpu} from './parsers/cpu';
import {parseExtras} from './parsers/extras';
import {parseHeader} from './parsers/headers';
import {parseImages} from './parsers/images';
import {parseReasons} from './parsers/reason';
import {parseThreads} from './parsers/threads';

const parsers = {
  cpu : parseCpu,
  extras : parseExtras,
  headers : parseHeader,
  images : parseImages,
  reason : parseReasons,
  threads : parseThreads
};

/**
 * Parses a provided report using the provided parser.
 * We fail safely (returning no output) to avoid crashing.
 *
 * @param parser the parser to work with.
 * @param report the input report.
 * @returns {*} a list of output.
 */
export function parse(parser, report) {
  if (parsers[parser]) {
    return parsers[parser](report);
  }
  return [];
}
