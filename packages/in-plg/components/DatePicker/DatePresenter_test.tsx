/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import DatePresenter from 'in-plg/components/DatePicker/DatePresenter';
import { TimeConfig } from 'in-types';

let onClick: jest.Mock<any, any>,
  timeConfig: TimeConfig,
  refSetter:
    | jest.Mock<any, any>
    | React.MutableRefObject<HTMLElement>
    | ((instance: HTMLElement | null) => void)
    | undefined;

beforeEach(() => {
  onClick = jest.fn();

  timeConfig = { autoRefresh: false, windowSize: 86400000, to: 1710253571003, focusedMoment: 1710253571003 };

  refSetter = jest.fn();
});

describe('DatePresenter Tests', () => {
  it('date presenter should be present', () => {
    render(<DatePresenter onClick={onClick} timeConfig={timeConfig} refSetter={refSetter} expanded={false} />);
    expect(screen.getByTestId('date-presenter-button')).toBeInTheDocument();
  });
});
