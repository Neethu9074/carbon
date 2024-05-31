/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import Immutable from 'immutable';
import { getNotes } from 'in-events/components/NotesAndActivity/utils';

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
          timestamp: 1234567890,
          author: 'user1',
          metadata: {},
          contents: 'This is a test note.',
          updated: false
        },
        {
          type: 'note',
          id: 'note2',
          parent: 'event1',
          timestamp: 1234567891,
          author: 'user2',
          metadata: {},
          contents: 'This is another test note.',
          updated: true
        },
        {
          type: 'NOTnote',
          id: 'note2',
          parent: 'event1',
          timestamp: 1234567891,
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
        timestamp: 1234567890,
        author: 'user1',
        metadata: Immutable.fromJS({}),
        contents: 'This is a test note.',
        updated: false
      },
      {
        type: 'note',
        id: 'note2',
        parent: 'event1',
        timestamp: 1234567891,
        author: 'user2',
        metadata: Immutable.fromJS({}),
        contents: 'This is another test note.',
        updated: true
      }
    ];
    expect(getNotes(event)).toEqual(expectedNotes);
  });

  it('returns an array even if note type is not found', () => {
    const event = Immutable.fromJS({
      notesUiObjects: [
        {
          type: 'NOTnote',
          id: 'note2',
          parent: 'event1',
          timestamp: 1234567891,
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
