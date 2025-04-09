/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import ActionConfiguration from 'in-automation/ActionDashboard/ActionConfiguration/ActionConfiguration';
import { ACTION_TYPE } from 'in-automation/constants';
import { ActionType } from 'in-types';

jest.mock('in-services/featureFlags', () => ({
  actionAiGenerationEnabled: true
}));

const mockData = {
  type: ACTION_TYPE.SCRIPT,
  id: 'testId',
  name: 'Test Name',
  description: 'Test Description',
  fields: [],
  inputParameters: [
    {
      name: 'node_name',
      label: 'Node Name',
      description: 'Test',
      required: false,
      hidden: false,
      secured: false,
      type: 'dynamic',
      value: '{"tagName":"kubernetes.node.name"}',
      valueType: 'map'
    }
  ],
  tags: ['kubernetes'],
  createdAt: 1739214997.033355,
  modifiedAt: 1742490889.245547
};

describe('ActionConfiguration', () => {
  global.TextDecoder = class {
    decode(buffer: Uint8Array) {
      return Buffer.from(buffer).toString('utf-8');
    }
  } as any;

  const actionTypes = Object.keys(ACTION_TYPE);

  actionTypes.forEach(type => {
    it(`renders ActionDetailsCard for type ${type}`, () => {
      mockData.type = ACTION_TYPE[type as ActionType];
      render(<ActionConfiguration data={mockData} />);
      expect(screen.getByText('Action details')).toBeInTheDocument();
    });
  });

  it('renders ActionConfigurationCard when data is provided', () => {
    render(<ActionConfiguration data={mockData} />);
    expect(screen.getByText('Action configuration')).toBeInTheDocument();
  });

  it('does not render ParameterDetailsCard when type is ACTION_TYPE.DOC_LINK or ACTION_TYPE.MANUAL', () => {
    mockData.type = ACTION_TYPE.DOC_LINK;
    render(<ActionConfiguration data={mockData} />);
    const card = screen.queryByText('Parameter details');
    expect(card).toBeNull();
  });

  it('renders ParameterDetailsCard when type is not ACTION_TYPE.DOC_LINK or ACTION_TYPE.MANUAL', () => {
    mockData.type = ACTION_TYPE.ANSIBLE;
    render(<ActionConfiguration data={mockData} />);
    expect(screen.getByText('Parameter details')).toBeInTheDocument();
  });

  it('renders AIScriptActionDialo when type is ACTION_TYPE.MANUALL', () => {
    mockData.type = ACTION_TYPE.MANUAL;
    render(<ActionConfiguration data={mockData} />);
    expect(screen.getByText('Generate script')).toBeInTheDocument();
  });
});
