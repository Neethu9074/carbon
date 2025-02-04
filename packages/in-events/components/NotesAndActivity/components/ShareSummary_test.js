/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shallow } from 'enzyme';
import React from 'react';

import { ShareSummary } from 'in-events/components/NotesAndActivity/components/ShareSummary';

import locals from './ShareSummary.mless';

describe('ShareSummary', () => {
  it('renders without errors', () => {
    shallow(<ShareSummary />);
  });

  it('shareSummary is rendered open no errors', async () => {
    const wrapper = shallow(<ShareSummary open />);
    expect(wrapper.find('#share-recipients')).toHaveLength(1);
    expect(wrapper.find('#share-subject')).toHaveLength(1);
    expect(wrapper.find('#share-summary')).toHaveLength(1);
    expect(wrapper.find(`div.${locals.errorMessage}`)).toHaveLength(0);
  });
});
