/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shallow } from 'enzyme';
import React from 'react';

import { CarbonButton } from '@instana/components';

import { QuickActions } from 'in-events/components/NotesAndActivity/components/QuickActions';
import { AIPopover } from 'in-events/components/NotesAndActivity/components/AiPopover';

import locals from './QuickActions.mless';

jest.mock('in-services/featureFlags');

jest.mock('in-services/featureFlags', () => ({
  get automationActionAiGenerationUnitEnabled() {
    return false;
  }
}));

describe('QuickActions - Consent form view', () => {
  it('renders without errors', () => {
    shallow(<QuickActions />);
  });

  it('renders the consent form with displayQuickStart TRUE', () => {
    const wrapper = shallow(<QuickActions displayQuickStart />);

    expect(wrapper.find(`div.${locals.quickActionsHeader}`)).toHaveLength(1);
    expect(wrapper.find(AIPopover)).toHaveLength(1);
    expect(wrapper.find(CarbonButton)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.consentWrapper}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.quickActionButtonContents}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.quickActionButtonContents}`).text()).toEqual('Review agreement');
  });

  it('renders a general case with displayQuickStart FALSE', () => {
    const wrapper = shallow(<QuickActions displayQuickStart={false} />);

    expect(wrapper.find(`div.${locals.transitionDown}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.quickActionsHeader}`)).toHaveLength(0);
    expect(wrapper.find(`div.${locals.quickActionsDescription}`)).toHaveLength(0);
    expect(wrapper.find(AIPopover)).toHaveLength(0);
    expect(wrapper.find(CarbonButton)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.consentWrapper}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.quickActionButtonContents}`)).toHaveLength(1);
    expect(wrapper.find(`div.${locals.quickActionButtonContents}`).text()).toEqual('Review agreement');
  });
});
