/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';
import { shallow } from 'enzyme';
import { ChatBubble, CommentList } from './NotesAndActivity.js';
import { SvgIcon } from '@instana/components';
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
    const notes = [{
      name: 'John Doe',
      note: 'This is a test note.',
      time: '12:00 PM'
    }, {
      name: 'Jane Doe',
      note: 'This is another test note.',
      time: '12:05 PM'
    }];
    const wrapper = shallow(<CommentList notes={notes} preferredName={"John Doe"}/>);
    expect(wrapper.find(`div.${locals.chatEntry}`)).toHaveLength(2);
    expect(wrapper.find(`div.${locals.myChatEntry}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.chatEntryInfo}`)).toHaveLength(2);
    expect(wrapper.find(`div.${locals.chatEntryInfo}`).at(0).text()).toEqual("You | 12:00 PM");
    expect(wrapper.find(`div.${locals.chatEntryInfo}`).at(1).text()).toEqual("Jane Doe | 12:05 PM");
    expect(wrapper.find(SvgIcon)).toHaveLength(1);
  });

  it('renders each comment in a div with the correct class names', () => {
    const notes = [];
    const wrapper = shallow(<CommentList notes={notes} preferredName={"John Doe"}/>);
    expect(wrapper.find(`div.${locals.chatEntry}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.myChatEntry}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.chatEntryInfo}`)).toHaveLength(0);
    expect(wrapper.find(SvgIcon)).toHaveLength(0);
  });
});