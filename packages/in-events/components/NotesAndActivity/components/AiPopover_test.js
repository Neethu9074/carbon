/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { shallow } from 'enzyme';
import React from 'react';

import { AIPopover, AIExplainedContent } from 'in-events/components/NotesAndActivity/components/AiPopover';

import locals from './AiPopover.mless';

describe('AIPopover', () => {
  it('should render the AIPopover component', () => {
    shallow(<AIPopover />);
  });

  it('should open the popover when clicking on the icon', () => {
    const component = render(<AIPopover />);
    const icon = component.container.querySelector('#ai_slug_icon');
    userEvent.click(icon);
    const popover = component.container.querySelector('#ai_popover_content');
    expect(popover).toBeVisible();
  });

  it('should close the popover when clicking on the close button', () => {
    const component = render(<AIPopover />);
    const icon = component.container.querySelector('#ai_slug_icon');
    userEvent.click(icon);
    const closeButton = component.container.querySelector('#ai_popover_close');
    userEvent.click(closeButton);
    const popover = component.container.querySelector('.cds--popover--open');
    expect(popover).toBeNull();
  });
});

describe('AIExplainedContent', () => {
  it('renders correctly without errors', () => {
    shallow(<AIExplainedContent />);
  });

  it('renders the correct popup description text', () => {
    const getByText = shallow(<AIExplainedContent />);
    expect(getByText.find(`div.${locals.popupDescription}`)).toHaveLength(1);
    expect(getByText.find(`div.${locals.popupDescription}`).text()).toEqual(
      'AI explainedSummarizationTo generate an incident summary we send incident and associated event data to watsonx. The data is processed using an AI model and watsonx returns a concise summary grouped by the affected entities.'
    );
  });

  it('renders the correct dataTypesHeader info text', () => {
    const getByText = shallow(<AIExplainedContent />);
    expect(getByText.find(`div.${locals.dataTypesHeader}`)).toHaveLength(1);
    expect(getByText.find(`div.${locals.dataTypesHeader}`).text()).toEqual('Data types used');
  });

  it('renders the correct bullet info text', () => {
    const getByText = shallow(<AIExplainedContent />);
    expect(getByText.find(`div.${locals.bullet}`)).toHaveLength(3);
    expect(getByText.find(`div.${locals.bullet}`).first().text()).toEqual('- <Trans />');
    expect(getByText.find(`div.${locals.bullet}`).last().text()).toEqual('- <Trans />');
  });

  it('renders the correct ai model link info text', () => {
    const getByText = shallow(<AIExplainedContent />);
    expect(getByText.find(`div.${locals.aimodellink}`)).toHaveLength(1);
    expect(getByText.find(`div.${locals.aimodellink}`).text()).toEqual('AI modelgranite-3-8b-instruct');
  });
});
