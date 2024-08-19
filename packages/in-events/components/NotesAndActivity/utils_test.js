/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import Immutable from 'immutable';

import {
  getNotes,
  validTextEntry,
  noteNameAndTimeFormat,
  filterSearchNotes
} from 'in-events/components/NotesAndActivity/utils';

describe('getNotes', () => {
  it('returns an empty array if the event is falsy', () => {
    expect(getNotes(null)).toEqual([]);
    expect(getNotes(undefined)).toEqual([]);
  });

  it('returns an empty array if the event does not have any notes', () => {
    const event = Immutable.fromJS({
      notesUiObjects: []
    });
    expect(getNotes(event)).toEqual([]);
  });

  it('returns an array of notes if the event has notes', () => {
    const event = Immutable.fromJS({
      notesUiObjects: [
        {
          type: 'note',
          id: 'note1',
          parent: 'event1',
          timestamp: 1717523244282,
          author: 'user1',
          metadata: {},
          contents: 'This is a test note.',
          updated: false
        },
        {
          type: 'note',
          id: 'note2',
          parent: 'event1',
          timestamp: 1717523244282,
          author: 'user2',
          metadata: {},
          contents: 'This is another test note.',
          updated: true
        },
        {
          type: 'NOTnote',
          id: 'note2',
          parent: 'event1',
          timestamp: 1717523244282,
          author: 'user2',
          metadata: {},
          contents: 'This is another test note.',
          updated: true
        }
      ]
    });
    const expectedNotes = [
      {
        type: 'note',
        id: 'note1',
        parent: 'event1',
        timestamp: 1717523244282,
        author: 'user1',
        metadata: Immutable.fromJS({}),
        contents: 'This is a test note.',
        updated: false
      },
      {
        type: 'note',
        id: 'note2',
        parent: 'event1',
        timestamp: 1717523244282,
        author: 'user2',
        metadata: Immutable.fromJS({}),
        contents: 'This is another test note.',
        updated: true
      }
    ];
    expect(getNotes(event)).toEqual(expectedNotes);
    const event1 = Immutable.fromJS({
      journals: [
        {
          type: 'note',
          id: 'note1',
          parent: 'event1',
          timestamp: 1717523244282,
          author: 'user1',
          metadata: {},
          contents: 'This is a test note.',
          updated: false
        },
        {
          type: 'note',
          id: 'note2',
          parent: 'event1',
          timestamp: 1717523244282,
          author: 'user2',
          metadata: {},
          contents: 'This is another test note.',
          updated: true
        },
        {
          type: 'NOTnote',
          id: 'note2',
          parent: 'event1',
          timestamp: 1717523244282,
          author: 'user2',
          metadata: {},
          contents: 'This is another test note.',
          updated: true
        }
      ]
    });
    expect(getNotes(event1)).toEqual(expectedNotes);
  });

  it('returns an array even if note type is not found', () => {
    const event = Immutable.fromJS({
      notesUiObjects: [
        {
          type: 'NOTnote',
          id: 'note2',
          parent: 'event1',
          timestamp: new Date(1717523244282),
          author: 'user2',
          metadata: {},
          contents: 'This is another test note.',
          updated: true
        }
      ]
    });
    expect(getNotes(event)).toEqual([]);
  });
});

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
    expect(noteNameAndTimeFormat(undefined)).toEqual('undefined | undefined');
  });

  const note = { author: 'dart' };

  it('general cases', () => {
    expect(noteNameAndTimeFormat(false, note, '2024-06-04, 19:41:28')).toEqual('dart | 2024-06-04, 19:41:28');
    expect(noteNameAndTimeFormat(true, note, '2024-06-04, 19:41:28')).toEqual('You | 2024-06-04, 19:41:28');
  });
});

describe('filterSearchNotes', () => {
  test('should return an empty array if no notes are provided', () => {
    const result = filterSearchNotes([], 'test');
    expect(result).toEqual([]);
  });

  test('should return an full array if no input is provided', () => {
    const note = [{ id: 1, author: 'John Doe', contents: 'Test note' }];
    const result = filterSearchNotes(note, '');
    expect(result).toEqual(note);
  });

  test('should return an array of notes that match the input', () => {
    const notes = [
      { id: 1, author: 'John Doe', contents: 'Test note' },
      { id: 2, author: 'Jane Doe', contents: 'Another test note' },
      { id: 3, author: 'John Doe', contents: 'Yet another test note' }
    ];

    const result = filterSearchNotes(notes, 'test');
    expect(result).toEqual(notes);
  });

  test('should return an array of notes that match the input round 2', () => {
    const notes = [
      { id: 1, author: 'John Doe', contents: 'Test note' },
      { id: 2, author: 'Jane Doe', contents: 'Another test note' },
      { id: 3, author: 'John Doe', contents: 'Yet another test note' }
    ];

    const result = filterSearchNotes(notes, 'another');
    expect(result).toEqual([
      { id: 2, author: 'Jane Doe', contents: 'Another test note' },
      { id: 3, author: 'John Doe', contents: 'Yet another test note' }
    ]);
  });

  test('should return an array of notes that match the input round 3', () => {
    const notes = [
      { id: 1, author: 'John Doe', contents: 'Test note' },
      {
        id: 15,
        authors: 'Denton V',
        data: [
          ['Priority', '0', '1 - Critical'],
          ['Incident state', 'opened', 'In progress'],
          ['Opened by', '', 'ITIL User']
        ]
      },
      { id: 2, author: 'Jane Doe', contents: 'Another test note' },
      { id: 3, author: 'John Doe', contents: 'Yet another test note' }
    ];

    const result = filterSearchNotes(notes, 'progress');
    expect(result).toEqual([
      {
        id: 15,
        authors: 'Denton V',
        data: [
          ['Priority', '0', '1 - Critical'],
          ['Incident state', 'opened', 'In progress'],
          ['Opened by', '', 'ITIL User']
        ]
      }
    ]);
  });
});
