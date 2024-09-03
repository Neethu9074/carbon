/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  validTextEntry,
  noteNameAndTimeFormat,
  createDataString
} from 'in-events/components/NotesAndActivity/components/utils';

describe('validTextEntry', () => {
  it('undefined and null checks should return false', () => {
    expect(validTextEntry(null)).toEqual(false);
    expect(validTextEntry(undefined)).toEqual(false);
  });

  it('empty string returns false', () => {
    expect(validTextEntry('')).toEqual(false);
    expect(validTextEntry('      ')).toEqual(false);
  });

  it('general cases should return true', () => {
    expect(validTextEntry('  s    ')).toEqual(true);
    expect(validTextEntry('this should be valid')).toEqual(true);
  });
});

describe('noteNameAndTimeFormat', () => {
  it('undefined checks, nothing crashes', () => {
    expect(noteNameAndTimeFormat(undefined)).toEqual('undefined undefined');
  });

  const note = { author: 'dart', origin: 'LegendOfDragoon' };

  it('general cases', () => {
    expect(noteNameAndTimeFormat(false, note, '2024-06-04, 19:41:28', 'note')).toEqual('dart 2024-06-04, 19:41:28');
    expect(noteNameAndTimeFormat(true, note, '2024-06-04, 19:41:28', 'note')).toEqual('You 2024-06-04, 19:41:28');
    expect(noteNameAndTimeFormat(false, note, '2024-06-04, 19:41:28', 'external_note')).toEqual(
      'LegendOfDragoon 2024-06-04, 19:41:28'
    );
    expect(noteNameAndTimeFormat(true, note, '2024-06-04, 19:41:28', 'external_note')).toEqual(
      'LegendOfDragoon 2024-06-04, 19:41:28'
    );
    expect(noteNameAndTimeFormat(false, note, '2024-06-04, 19:41:28', 'ai_generated')).toEqual(
      'watsonx 2024-06-04, 19:41:28'
    );
  });
});

describe('createDataString', () => {
  test('createDataString edge cases', () => {
    const result = createDataString([]);
    expect(result).toEqual([]);
    const resultTwo = createDataString();
    expect(resultTwo).toEqual([]);
  });

  test('createDataString general cases', () => {
    const result = createDataString([
      ['Priority', '0', '1 - Critical'],
      ['Incident state', 'opened', 'In progress'],
      ['Opened by', '', 'ITIL User']
    ]);
    expect(result).toEqual(['Priority: 1 - Critical\n', 'Incident state: In progress\n', 'Opened by: ITIL User\n']);
  });

  test('createDataString unexpected cases', () => {
    const result = createDataString([
      ['Priority', '0', '1 - Critical', 'test'],
      ['Incident state', 'opened'],
      ['Opened by', '', 'ITIL User']
    ]);
    expect(result).toEqual(['Priority: 1 - Critical\n', 'Incident state: \n', 'Opened by: ITIL User\n']);
  });
});
