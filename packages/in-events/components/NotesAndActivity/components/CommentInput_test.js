/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shallow } from 'enzyme';
import React from 'react';

import { CarbonTextArea, IconButton } from '@instana/components';

import {
  CommentInput,
  SubmissionButtons,
  handleSubmitNote
} from 'in-events/components/NotesAndActivity/components/CommentInput';

import locals from './CommentInput.mless';

describe('CommentInput', () => {
  it('renders without errors', () => {
    shallow(<CommentInput />);
  });

  it('renders the commentInput for the general case', () => {
    const wrapper = shallow(
      <CommentInput
        user="John Doe"
        incidentId="89dfa89fdsjcv9ads"
        editNoteId={false}
        setNote={() => {}}
        setEditNoteId={() => {}}
        note={{
          author: 'John Doe',
          type: 'note',
          contents: 'Hello',
          timestamp: 1717523244282
        }}
      />
    );
    expect(wrapper.find(`div.${locals.commentInputWrapperNotes}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.commentInputWrapperNotes}`).text()).toEqual('<SubmissionButtons />');
    expect(wrapper.find(SubmissionButtons)).toHaveLength(1);
    expect(wrapper.find(CarbonTextArea)).toHaveLength(1);
  });
});

describe('SubmissionButtons', () => {
  it('renders without errors', () => {
    shallow(<SubmissionButtons />);
  });

  it('renders the submission buttons when not in edit mode', () => {
    const wrapper = shallow(
      <SubmissionButtons
        contents="Hello"
        myBubble
        type="note"
        user="John Doe"
        incidentId="89dfa89fdsjcv9ads"
        editNoteId={false}
        setNote={() => {}}
        setEditNoteId={() => {}}
        note={{
          author: 'John Doe',
          type: 'note',
          contents: 'Hello',
          timestamp: 1717523244282
        }}
      />
    );
    expect(wrapper.find(IconButton)).toHaveLength(1);
  });

  it('renders the submission buttons when not in edit mode', () => {
    const wrapper = shallow(
      <SubmissionButtons
        contents="Hello"
        myBubble
        type="note"
        user="John Doe"
        incidentId="89dfa89fdsjcv9ads"
        editNoteId={['92098s8f87', true]}
        setNote={() => {}}
        setEditNoteId={() => {}}
        note={{
          author: 'John Doe',
          type: 'note',
          contents: 'Hello',
          timestamp: 1717523244282
        }}
      />
    );
    expect(wrapper.find(IconButton)).toHaveLength(2);
  });
});

describe('handleSubmitNote', () => {
  it('should not fire off a new note without there being something written', () => {
    const incidentId = '123';
    const note = '';
    const setNote = jest.fn();
    const annotateEvent = jest.fn();
    const handleTracking = jest.fn();

    handleSubmitNote(incidentId, note, setNote);

    expect(annotateEvent).not.toHaveBeenCalled();
    expect(setNote).not.toHaveBeenCalled();
    expect(handleTracking).not.toHaveBeenCalled();
  });
});
