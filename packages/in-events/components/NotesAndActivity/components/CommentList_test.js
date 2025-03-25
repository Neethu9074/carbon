/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import Immutable from 'immutable';
import { shallow } from 'enzyme';
import React from 'react';

import { SvgIcon } from '@instana/components';

import {
  CommentList,
  ChatBubble,
  EditDeleteOverflowMenu
} from 'in-events/components/NotesAndActivity/components/CommentList';

import locals from './CommentList.mless';

jest.mock('in-stores/user');

jest.mock('in-stores/user', () => ({
  get user() {
    return { preferredName: 'John Doe', id: 'asdf' };
  }
}));

describe('ChatBubble', () => {
  it('renders without errors', () => {
    shallow(<ChatBubble />);
  });

  it('renders the text in a div with the correct class name', () => {
    const wrapper = shallow(<ChatBubble myBubble contents="Hello" data={[]} type="note" noteObj={{}} />);
    expect(wrapper.find(`div.${locals.bubble}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.bubble}`).text()).toEqual('Hello');
    expect(wrapper.find(`div.${locals.ext}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.aiGenBubble}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.myBubble}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.bubbleContentsHeader}`)).toHaveLength(0);
  });

  it('renders the text in a div with the correct class name when myBubble is true', () => {
    const wrapper = shallow(
      <ChatBubble
        contents="Hello"
        myBubble
        type="note"
        noteObj={{
          author: 'John Doe',
          type: 'note',
          contents: 'Hello',
          timestamp: 1717523244282
        }}
      />
    );
    expect(wrapper.find(`div.${locals.bubble}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.myBubble}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.myBubble}`).text()).toEqual('Hello');
    expect(wrapper.find(`div.${locals.ext}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.aiGenBubble}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.bubbleContentsHeader}`)).toHaveLength(0);
    expect(wrapper.find(EditDeleteOverflowMenu)).toHaveLength(1);
  });

  it('renders the text in a div with the correct class name when myBubble is false', () => {
    const wrapper = shallow(
      <ChatBubble
        contents="Hello"
        myBubble={false}
        type="external_note"
        noteObj={{
          author: 'John Doe',
          type: 'external_note',
          contents: 'Hello',
          timestamp: 1717523244282,
          label: 'Ext Note'
        }}
      />
    );
    expect(wrapper.find(`div.${locals.ext}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.ext}`).text()).toEqual('<ExternalNote />');
    expect(wrapper.find(`div.${locals.bubble}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.myBubble}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.aiGenBubble}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.bubbleContentsHeader}`)).toHaveLength(0);
    expect(wrapper.find(EditDeleteOverflowMenu)).toHaveLength(0);
  });

  it('renders the text in a div with the correct class name for ai_summary', () => {
    const wrapper = shallow(
      <ChatBubble
        contents="This is an ai generated message"
        myBubble={false}
        type="ai_summary"
        noteObj={{
          author: 'John Doe',
          type: 'external_note',
          data: [
            new Map([
              ['entitySummary', 'This is an ai generated message'],
              ['entityLabel', 'LABEL']
            ])
          ],
          timestamp: 1717523244282,
          label: 'AI Summary'
        }}
      />
    );

    expect(wrapper.find(`div.${locals.ext}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.bubble}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.myBubble}`)).toHaveLength(0);
    expect(wrapper.find(EditDeleteOverflowMenu)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.aiGenBubble}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.aiGenBubble}`).text()).toEqual('<AISummary />');
  });

  it('renders the text in a div with the correct class name for external_field_change', () => {
    const wrapper = shallow(
      <ChatBubble
        contents="Hello"
        myBubble={false}
        type="external_field_change"
        noteObj={{
          author: 'John Doe',
          type: 'external_note',
          contents: 'This is an ai generated message',
          timestamp: 1717523244282,
          label: 'Updated Status',
          metadata: Immutable.fromJS({
            updatedBy: 'josh'
          }),
          data: [
            ['Priority', '0', '1 - Critical'],
            ['incident state', 'opened', 'In progress'],
            ['opened by', '', 'ITIL User']
          ]
        }}
      />
    );

    expect(wrapper.find(`div.${locals.ext}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.ext}`).text()).toEqual('Updated Status(updated by josh)');
    expect(wrapper.find(`div.${locals.bubble}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.myBubble}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.aiGenBubble}`)).toHaveLength(0);
    expect(wrapper.find(EditDeleteOverflowMenu)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.bubbleContentsHeader}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.bubbleContentsHeader}`).text()).toEqual('Updated Status(updated by josh)');
  });
});

describe('CommentList', () => {
  it('renders without errors', () => {
    shallow(<CommentList />);
  });

  it('renders each comment in a div with the correct class names', () => {
    const notes = [
      {
        author: 'John Doe',
        authorId: 'asdf',
        type: 'note',
        contents: 'This is a test note.',
        timestamp: 1717523244282
      },
      {
        author: 'Jane Doe',
        authorId: 'asdfasdf',
        type: 'note',
        note: 'This is another test note.',
        timestamp: 1717523244282
      }
    ];
    const wrapper = shallow(<CommentList notes={notes} />);
    expect(wrapper.find(`div.${locals.chatEntry}`)).toHaveLength(2);
    expect(wrapper.find(`div.${locals.myChatEntry}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.chatEntryInfo}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.chatEntryInfo}`).at(0).text()).toEqual('Jane Doe 2024-06-04, 19:47:24');
    expect(wrapper.find(`div.${locals.myChatEntryInfo}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.myChatEntryInfo}`).at(0).text()).toEqual('You 2024-06-04, 19:47:24');
    expect(wrapper.find(SvgIcon)).toHaveLength(1);
    expect(wrapper.find(ChatBubble)).toHaveLength(2);
  });

  it(' Case for handling an empty notes list', () => {
    const notes = [];
    const wrapper = shallow(<CommentList notes={notes} />);
    expect(wrapper.find(`div.${locals.chatEntry}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.myChatEntry}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.chatEntryInfo}`)).toHaveLength(0);
    expect(wrapper.find(SvgIcon)).toHaveLength(0);
    expect(wrapper.find(ChatBubble)).toHaveLength(0);
  });
});
