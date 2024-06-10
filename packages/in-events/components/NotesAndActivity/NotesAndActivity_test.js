/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shallow } from 'enzyme';
import React from 'react';

import { SvgIcon } from '@instana/components';

import { ChatBubble, CommentList, EmptyState } from './NotesAndActivity.js';

import locals from './NotesAndActivity.mless';

describe('ChatBubble', () => {
  it('renders without errors', () => {
    shallow(<ChatBubble />);
  });

  it('renders the text in a div with the correct class name', () => {
    const wrapper = shallow(<ChatBubble text="Hello" />);
    expect(wrapper.find(`div.${locals.bubble}`).text()).toEqual('Hello');
  });

  it('renders the text in a div with the correct class name when myBubble is true', () => {
    const wrapper = shallow(<ChatBubble text="Hello" myBubble />);
    expect(wrapper.find(`div.${locals.myBubble}`).text()).toEqual('Hello');
  });

  it('renders the text in a div with the correct class name when myBubble is false', () => {
    const wrapper = shallow(<ChatBubble text="Hello" myBubble={false} />);
    expect(wrapper.find(`div.${locals.otherBubble}`).text()).toEqual('Hello');
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
        contents: 'This is a test note.',
        timestamp: 1717523244282
      },
      {
        author: 'Jane Doe',
        note: 'This is another test note.',
        timestamp: 1717523244282
      }
    ];
    const wrapper = shallow(<CommentList notes={notes} preferredName={'John Doe'} />);
    expect(wrapper.find(`div.${locals.chatEntry}`)).toHaveLength(2);
    expect(wrapper.find(`div.${locals.myChatEntry}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.chatEntryInfo}`)).toHaveLength(2);
    expect(wrapper.find(`div.${locals.chatEntryInfo}`).at(0).text()).toEqual('Jane Doe | 2024-06-04, 19:47:24');
    expect(wrapper.find(`div.${locals.chatEntryInfo}`).at(1).text()).toEqual('You | 2024-06-04, 19:47:24');
    expect(wrapper.find(SvgIcon)).toHaveLength(1);
    expect(wrapper.find(ChatBubble)).toHaveLength(2);
    expect(wrapper.find(EmptyState)).toHaveLength(0);
  });

  it('renders each comment in a div with the correct class names', () => {
    const notes = [];
    const wrapper = shallow(<CommentList notes={notes} preferredName={'John Doe'} />);
    expect(wrapper.find(`div.${locals.chatEntry}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.myChatEntry}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.chatEntryInfo}`)).toHaveLength(0);
    expect(wrapper.find(SvgIcon)).toHaveLength(0);
    expect(wrapper.find(EmptyState)).toHaveLength(1);
    expect(wrapper.find(ChatBubble)).toHaveLength(0);
  });
});

describe('EmptyState', () => {
  it('renders without errors', () => {
    shallow(<EmptyState />);
  });

  it('renders each comment with the correct class names', () => {
    const wrapper = shallow(<EmptyState />);
    expect(wrapper.find(`div.${locals.emptyWrapper}`)).toHaveLength(1);
    expect(wrapper.find(`h3.${locals.emptyHeader}`)).toHaveLength(1);
    expect(wrapper.find(`h3.${locals.emptyHeader}`).text()).toEqual('No notes added yet');
    expect(wrapper.find(`p.${locals.emptyInfo}`)).toHaveLength(1);
    expect(wrapper.find(`p.${locals.emptyInfo}`).text()).toEqual('Get started by adding a note for your team.');
  });
});
