/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { isNotBlank } from 'in-services/util/string';

export function serializeLines(lines) {
  return lines.map(({ file, name, line, column }) => serializeLine(file, name, line, column)).join('\n');
}

export function serializeLine(file, name, line, column) {
  let str = '';

  if (isNotBlank(name)) {
    str += name;
  }

  if (isNotBlank(file)) {
    if (isNotBlank(name)) {
      str += ' in ';
    }
    str += file;
  }

  if (line > 0) {
    str += ' at ' + line;

    if (column > 0) {
      str += ':' + column;
    }
  }

  return str;
}
