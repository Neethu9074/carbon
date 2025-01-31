/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import Immutable from 'immutable';
import { shallow } from 'enzyme';
import React from 'react';

import { IconButton, CarbonSearch, CarbonInlineLoading, CarbonLayer, CarbonModal } from '@instana/components';

import { NotesAndActivity, EmptyState } from 'in-events/components/NotesAndActivity/NotesAndActivity';
import { CommentInput } from 'in-events/components/NotesAndActivity/components/CommentInput';
import { QuickActions } from 'in-events/components/NotesAndActivity/components/QuickActions';
import { CommentList } from 'in-events/components/NotesAndActivity/components/CommentList';

import locals from './NotesAndActivity.mless';

jest.mock('in-services/featureFlags');

jest.mock('in-services/featureFlags', () => ({
  get incidentSummarizationEnabled() {
    return true;
  }
}));

describe('NotesAndActivity', () => {
  it('renders without errors', () => {
    shallow(<NotesAndActivity />);
  });

  it('renders a general case for NotesAndActivity for empty list', () => {
    const event = Immutable.fromJS({
      type: 'incident',
      id: 'myID123',
      notesUiObjects: []
    });

    const wrapper = shallow(<NotesAndActivity event={event} displayNotes setDisplayNotes={() => {}} />);

    expect(wrapper.find(CarbonLayer)).toHaveLength(1);
    expect(wrapper.find(IconButton)).toHaveLength(3);
    expect(wrapper.find(CarbonInlineLoading)).toHaveLength(0);
    expect(wrapper.find(CarbonSearch)).toHaveLength(0);
    expect(wrapper.find(CommentList)).toHaveLength(1);
    expect(wrapper.find(CommentInput)).toHaveLength(1);
    expect(wrapper.find(QuickActions)).toHaveLength(1);
    expect(wrapper.find(CarbonModal)).toHaveLength(1);
  });

  it('renders a general case for NotesAndActivity', () => {
    const event = Immutable.fromJS({
      type: 'incident',
      id: 'myID123',
      notesUiObjects: [
        {
          type: 'external_note',
          id: 'note-12345',
          parent: 'bZn54ySOQaGEyt9Ls2eZ3g',
          timestamp: 1692892800000,
          updated: 0,
          author: 'johndoe',
          metadata: {
            apiToken: 'iid-valid-api-token',
            createdBy: 'johndoe',
            priority: 'High',
            userId: null
          },
          origin: '',
          internal: true,
          label: 'Work Notes',
          contents: 'This is an internal note regarding the test'
        }
      ]
    });

    const wrapper = shallow(<NotesAndActivity event={event} displayNotes setDisplayNotes={() => {}} />);

    expect(wrapper.find(CarbonLayer)).toHaveLength(1);
    expect(wrapper.find(IconButton)).toHaveLength(3);
    expect(wrapper.find(CarbonInlineLoading)).toHaveLength(0);
    expect(wrapper.find(CarbonSearch)).toHaveLength(0);
    expect(wrapper.find(CommentList)).toHaveLength(1);
    expect(wrapper.find(CommentInput)).toHaveLength(1);
    expect(wrapper.find(QuickActions)).toHaveLength(1);
    expect(wrapper.find(CarbonModal)).toHaveLength(1);
  });
});

describe('EmptyState', () => {
  it('renders correctly without errors', () => {
    shallow(<EmptyState />);
  });

  it('renders the correct empty state header text', () => {
    const getByText = shallow(<EmptyState />);
    expect(getByText.find(`h3.${locals.emptyHeader}`)).toHaveLength(1);
    expect(getByText.find(`h3.${locals.emptyHeader}`).text()).toEqual('No activity yet');
  });

  it('renders the correct empty state info text', () => {
    const getByText = shallow(<EmptyState />);
    expect(getByText.find(`p.${locals.emptyInfo}`)).toHaveLength(1);
    expect(getByText.find(`p.${locals.emptyInfo}`).text()).toEqual(
      'There are no notes or activity to show yet. Use the Add comment field to share knowledge or an update for this incident with your team.'
    );
  });
});
