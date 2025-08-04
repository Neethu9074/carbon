/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shallow } from 'enzyme';
import React from 'react';

import { MS_TEAMS, SERVICE_NOW, SLACK } from 'in-events/components/NotesAndActivity/components/NoteTypes/utils';
import { ExternalNote } from 'in-events/components/NotesAndActivity/components/NoteTypes/ExternalNote';

import locals from './ExternalNote.mless';

describe('ExternalNote', () => {
  it('renders without errors', () => {
    shallow(<ExternalNote />);
  });

  it('renders the component with no data', () => {
    const wrapper = shallow(<ExternalNote noteObj={{}} />);
    expect(wrapper.find(`div.${locals.noteTypeHeading}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.contents}`)).toHaveLength(0);
  });

  it('renders the component with snow data', () => {
    const noteObj = {
      author: 'John Doe SNOW',
      origin: SERVICE_NOW,
      type: 'external_note',
      contents: 'Hello SNOW',
      timestamp: 1717523244282,
      label: 'Additional Comments'
    };
    const wrapper = shallow(<ExternalNote noteObj={noteObj} />);
    expect(wrapper.find(`div.${locals.noteTypeHeading}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.noteTypeHeading}`).text()).toEqual('Additional Comments');
    expect(wrapper.find(`div.${locals.contents}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.contents}`).text()).toEqual('Hello SNOW');
  });

  it('renders the component with slack data', () => {
    const noteObj = {
      author: 'John Doe Slack',
      origin: SLACK,
      type: 'external_note',
      contents: 'Hello Slack',
      timestamp: 1717523244282,
      label: 'Message'
    };
    const wrapper = shallow(<ExternalNote noteObj={noteObj} />);
    expect(wrapper.find(`div.${locals.noteTypeHeading}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.noteTypeHeading}`).text()).toEqual('John Doe SlackHello Slack');
    expect(wrapper.find(`div.${locals.contents}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.contents}`).text()).toEqual('Hello Slack');
  });

  it('renders the component with msteams data', () => {
    const noteObj = {
      author: 'John Doe MS Teams',
      origin: MS_TEAMS,
      type: 'external_note',
      contents: 'Hello MS Teams',
      timestamp: 1717523244282,
      label: 'Message'
    };
    const wrapper = shallow(<ExternalNote noteObj={noteObj} />);
    expect(wrapper.find(`div.${locals.noteTypeHeading}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.noteTypeHeading}`).text()).toEqual('John Doe MS TeamsHello MS Teams');
    expect(wrapper.find(`div.${locals.contents}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.contents}`).text()).toEqual('Hello MS Teams');
  });
});
