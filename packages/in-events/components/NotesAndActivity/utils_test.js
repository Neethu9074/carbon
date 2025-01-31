/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import Immutable from 'immutable';

import { getNotes, filterSearchNotes, getSummaryCount } from 'in-events/components/NotesAndActivity/utils';

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
          type: 'external_note',
          id: 'note1',
          parent: 'event1',
          timestamp: 1717523244282,
          author: 'user1',
          metadata: {},
          contents: 'This is a test note.',
          updated: false
        },
        {
          type: 'external_field_change',
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
      },
      {
        type: 'external_note',
        id: 'note1',
        parent: 'event1',
        timestamp: 1717523244282,
        author: 'user1',
        metadata: Immutable.fromJS({}),
        contents: 'This is a test note.',
        updated: false
      },
      {
        type: 'external_field_change',
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
          type: 'external_note',
          id: 'note1',
          parent: 'event1',
          timestamp: 1717523244282,
          author: 'user1',
          metadata: {},
          contents: 'This is a test note.',
          updated: false
        },
        {
          type: 'external_field_change',
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

  test('should return an array of notes that match the input (contents)', () => {
    const notes = [
      { id: 1, author: 'John Doe', contents: 'Test note' },
      { id: 2, author: 'Jane Doe', contents: 'Another test note' },
      { id: 3, author: 'John Doe', contents: 'Yet another test note' }
    ];

    const result = filterSearchNotes(notes, 'test');
    expect(result).toEqual(notes);
  });

  test('should return an array of notes that match the input round 2 (contents)', () => {
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

  test('should return an array of notes that match the input round 3 (data)', () => {
    const notes = [
      { id: 1, author: 'John Doe', contents: 'Test note' },
      {
        id: 15,
        authors: 'Denton V',
        data: Immutable.fromJS([
          ['Priority', '0', '1 - Critical'],
          ['Incident state', 'opened', 'In progress'],
          ['Opened by', '', 'ITIL User']
        ])
      },
      { id: 2, author: 'Jane Doe', contents: 'Another test note' },
      { id: 3, author: 'John Doe', contents: 'Yet another test note' }
    ];

    const result = filterSearchNotes(notes, 'progress');
    expect(result).toEqual([
      {
        id: 15,
        authors: 'Denton V',
        data: Immutable.fromJS([
          ['Priority', '0', '1 - Critical'],
          ['Incident state', 'opened', 'In progress'],
          ['Opened by', '', 'ITIL User']
        ])
      }
    ]);
  });

  test('should return an array of notes that match the input round 4 (author)', () => {
    const notes = [
      { id: 1, author: 'John Doe', contents: 'Test note' },
      {
        id: 15,
        authors: 'Denton V',
        data: Immutable.fromJS([
          ['Priority', '0', '1 - Critical'],
          ['Incident state', 'opened', 'In progress'],
          ['Opened by', '', 'ITIL User']
        ])
      },
      { id: 2, author: 'Jane Doe', contents: 'Another test note' },
      { id: 3, author: 'John Doe', contents: 'Yet another test note' }
    ];

    const expectedResult = [
      { id: 1, author: 'John Doe', contents: 'Test note' },
      { id: 2, author: 'Jane Doe', contents: 'Another test note' },
      { id: 3, author: 'John Doe', contents: 'Yet another test note' }
    ];

    const result = filterSearchNotes(notes, 'doe');
    expect(result).toEqual(expectedResult);
  });
});

describe('getSummaryCount', () => {
  // Define a mock array of notes for getSummaryCount
  const mockNotes = [
    { type: 'normal' },
    { type: 'normal' },
    { type: 'ai_summary' },
    { type: 'normal' },
    { type: 'ai_summary' }
  ];

  it('should return 0 if there are no AI summaries', () => {
    const mockNotesNoSummaries = [
      { type: 'normal' },
      { type: 'normal' },
      { type: 'normal' },
      { type: 'normal' },
      { type: 'normal' }
    ];
    expect(getSummaryCount(mockNotesNoSummaries)).toBe(0);
  });

  it('should return the correct count of AI summaries', () => {
    expect(getSummaryCount(mockNotes)).toBe(2);
  });
});
