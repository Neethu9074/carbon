/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import ActionSummary from 'in-automation/ActionDashboard/ActionSummary/ActionSummary';
import { ACTION_TYPE } from 'in-automation/constants';
import { ActionType } from 'in-types';

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
  metadata: {
    builtIn: false,
    aiOriginated: true,
    readOnly: true,
    sensorImported: true,
    ai: []
  },
  modifiedAt: 1742490889.245547
};

describe('ActionSummary', () => {
  global.TextDecoder = class {
    decode(buffer: Uint8Array) {
      return Buffer.from(buffer).toString('utf-8');
    }
  } as any;
  global.ResizeObserver = ResizeObserver;

  const actionTypes = Object.keys(ACTION_TYPE).filter(
    type => ![ACTION_TYPE.MANUAL, ACTION_TYPE.DOC_LINK].includes(type as ActionType)
  );
  const excludedActionTypes = [ACTION_TYPE.DOC_LINK, ACTION_TYPE.MANUAL];

  actionTypes.forEach(type => {
    it(`renders Number of times run Card for type ${type}`, () => {
      mockData.type = ACTION_TYPE[type as ActionType];
      render(<ActionSummary data={mockData} />);
      expect(screen.getByText('Number of times run')).toBeInTheDocument();
    });
  });

  actionTypes.forEach(type => {
    it(`renders ActionTable for type ${type}`, () => {
      mockData.type = ACTION_TYPE[type as ActionType];
      render(<ActionSummary data={mockData} />);
      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  excludedActionTypes.forEach(type => {
    it(`does not render Number of times run Card  when type is ${type}`, () => {
      mockData.type = ACTION_TYPE[type];
      render(<ActionSummary data={mockData} />);
      const card = screen.queryByText('Number of times run');
      expect(card).toBeNull();
    });
  });

  it('does not render PolicyTable for ai generated action', () => {
    mockData.metadata.builtIn = true;
    render(<ActionSummary data={mockData} />);
    const card = screen.queryByText('Associated policies');
    expect(card).toBeNull();
  });
});
