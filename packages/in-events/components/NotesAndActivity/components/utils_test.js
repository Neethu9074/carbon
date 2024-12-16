/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import Immutable from 'immutable';

import {
  validTextEntry,
  noteNameAndTimeFormat,
  createDataString,
  validRecipients
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
    expect(noteNameAndTimeFormat(false, note, '2024-06-04, 19:41:28', 'note', false)).toEqual(
      'dart 2024-06-04, 19:41:28'
    );
    expect(noteNameAndTimeFormat(true, note, '2024-06-04, 19:41:28', 'note', false)).toEqual(
      'You 2024-06-04, 19:41:28'
    );
    expect(noteNameAndTimeFormat(false, note, '2024-06-04, 19:41:28', 'note', true)).toEqual(
      'dart (edited) 2024-06-04, 19:41:28'
    );
    expect(noteNameAndTimeFormat(true, note, '2024-06-04, 19:41:28', 'note', true)).toEqual(
      'You (edited) 2024-06-04, 19:41:28'
    );
    expect(noteNameAndTimeFormat(false, note, '2024-06-04, 19:41:28', 'external_note', false)).toEqual(
      'LegendOfDragoon 2024-06-04, 19:41:28'
    );
    expect(noteNameAndTimeFormat(true, note, '2024-06-04, 19:41:28', 'external_note', false)).toEqual(
      'LegendOfDragoon 2024-06-04, 19:41:28'
    );
    expect(noteNameAndTimeFormat(true, note, '2024-06-04, 19:41:28', 'external_note', true)).toEqual(
      'LegendOfDragoon 2024-06-04, 19:41:28'
    );
    expect(noteNameAndTimeFormat(false, note, '2024-06-04, 19:41:28', 'ai_summary', false)).toEqual(
      'watsonx 2024-06-04, 19:41:28'
    );
    expect(noteNameAndTimeFormat(false, note, '2024-06-04, 19:41:28', 'ai_summary', true)).toEqual(
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
    const result = createDataString(
      Immutable.fromJS([
        ['Priority', '0', '1 - Critical'],
        ['Incident state', 'opened', 'In progress'],
        ['Opened by', '', 'ITIL User']
      ])
    );
    expect(result).toEqual(['Priority: 1 - Critical\n', 'Incident state: In progress\n', 'Opened by: ITIL User\n']);
  });

  test('createDataString unexpected cases', () => {
    const result = createDataString(
      Immutable.fromJS([
        ['Priority', '0', '1 - Critical', 'test'],
        ['Incident state', 'opened'],
        ['Opened by', '', 'ITIL User']
      ])
    );
    expect(result).toEqual(['Priority: 1 - Critical\n', 'Incident state: \n', 'Opened by: ITIL User\n']);
  });
});

describe('validRecipients', () => {
  test('should return false if the recipients come in not as a string', () => {
    const recipientsList = ['recipient1', 'recipient2'];

    const result = validRecipients(recipientsList);

    expect(result).toBe(false);
  });

  test('should return false if the recipients come in not as a string', () => {
    const recipientsList = 132;

    const result = validRecipients(recipientsList);

    expect(result).toBe(false);
  });

  test('should return false if the recipients list is empty', () => {
    const recipientsList = [];

    const result = validRecipients(recipientsList);

    expect(result).toBe(false);
  });

  test('should return false if the recipients list is null', () => {
    const recipientsList = null;

    const result = validRecipients(recipientsList);

    expect(result).toBe(false);
  });

  test('should return true if the recipients list is valid extra spaces', () => {
    const recipientsList = 'steveSarkesian@utexas.net, texasfootball@hookem.com,     extraspaces@asd.com';
    const result = validRecipients(recipientsList);
    expect(result).toBe(true);
    const recipientsList2 = 'steveSarkesian@utexas.net,texasfootball@hookem.com,extraspaces@asd.com';
    const result2 = validRecipients(recipientsList2);
    expect(result2).toBe(true);
  });

  test('should return true if the recipients list is valid single', () => {
    const recipientsList = 'steveSarkesian@utexas.net';

    const result = validRecipients(recipientsList);

    expect(result).toBe(true);
  });

  test('should return false if the recipients list is not valid single', () => {
    const recipientsList = 'steveSarkesian@utexas.';
    const result = validRecipients(recipientsList);
    expect(result).toBe(false);

    const recipientsList2 = 'steveSarkesian@utexas';
    const result2 = validRecipients(recipientsList2);
    expect(result2).toBe(false);

    const recipientsList3 = 'steveSarkesianutexas';
    const result3 = validRecipients(recipientsList3);
    expect(result3).toBe(false);

    const recipientsList4 = 'steveSarkesianutexas';
    const result4 = validRecipients(recipientsList4);
    expect(result4).toBe(false);

    const recipientsList5 = 'steveSar.asd@kesianutexas';
    const result5 = validRecipients(recipientsList5);
    expect(result5).toBe(false);
  });

  test('should return false if any of the recipients list is invalid', () => {
    const recipientsList = 'steveSarkesian@utexas.net., texasfootball@hookem.com,     extraspaces@asd.com';
    const result = validRecipients(recipientsList);
    expect(result).toBe(false);

    const recipientsList2 = 'steveSarkesian@utexas.net, texasfootball@hookem,     extraspaces@asd.com';
    const result2 = validRecipients(recipientsList2);
    expect(result2).toBe(false);

    const recipientsList3 = 'steveSarkesian@utexas.net, texasfootball@hookem.com     extraspaces@asd.com';
    const result3 = validRecipients(recipientsList3);
    expect(result3).toBe(false);

    const recipientsList4 = 'steveSarkesian@utexas.net, texasfootball@hookem.com;     extraspaces@asd.com';
    const result4 = validRecipients(recipientsList4);
    expect(result4).toBe(false);

    const recipientsList5 = 'steveSarkesian@utexas.net, texasfootball@hookem.com,extraspaces@asd.c';
    const result5 = validRecipients(recipientsList5);
    expect(result5).toBe(false);
  });
});
