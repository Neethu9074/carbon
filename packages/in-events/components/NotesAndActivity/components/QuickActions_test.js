/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shallow } from 'enzyme';
import React from 'react';

import { SvgIcon, CarbonButton } from '@instana/components';

import { QuickActions } from 'in-events/components/NotesAndActivity/components/QuickActions';

import locals from './QuickActions.mless';

describe('QuickActions', () => {
  it('renders without errors', () => {
    shallow(<QuickActions />);
  });

  it('renders a general case with displayQuickStart TRUE', () => {
    const wrapper = shallow(<QuickActions displayQuickStart />);

    expect(wrapper.find(`div.${locals.transitionDown}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.quickActionsHeader}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.quickActionsDescription}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.extraPadding}`)).toHaveLength(0);
    expect(wrapper.find(SvgIcon)).toHaveLength(1);
    expect(wrapper.find(CarbonButton)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.quickActionButtonContents}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.quickActionButtonContents}`).text()).toEqual('Generate a summary');
  });

  it('renders a general case with displayQuickStart FALSE', () => {
    const wrapper = shallow(<QuickActions displayQuickStart={false} />);

    expect(wrapper.find(`div.${locals.transitionDown}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.quickActionsHeader}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.quickActionsDescription}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.extraPadding}`)).toHaveLength(1);
    expect(wrapper.find(SvgIcon)).toHaveLength(0);
    expect(wrapper.find(CarbonButton)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.quickActionButtonContents}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.quickActionButtonContents}`).text()).toEqual('Generate a summary');
  });
});
