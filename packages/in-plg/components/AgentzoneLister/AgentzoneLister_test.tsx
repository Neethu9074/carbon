/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import React from 'react';

import AgentzoneLister from 'in-plg/components/AgentzoneLister/AgentzoneLister';
import { t } from 'in-i18n';

describe('in-plg/components/AgentzoneLister/AgentzoneLister', () => {
  it('Renders AgentzoneLister with proper texts', () => {
    const mockCallback = jest.fn();
    const { getByText } = render(<AgentzoneLister callBackFunc={mockCallback} />);
    expect(getByText(t('in-plg:agentDetails.common.agentZoneOptional'))).toBeInTheDocument();
    expect(getByText(t('in-plg:Components.AgentzoneLister.EGEurope'))).toBeInTheDocument();
  });
});
