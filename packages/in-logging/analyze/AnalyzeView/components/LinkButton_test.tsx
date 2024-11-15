/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { LinkButton } from 'in-logging/analyze/AnalyzeView/components/LinkButton';

const now = 1729752315022;
const timeConfig = {
  to: now,
  windowSize: 86400000,
  focusedMoment: now,
  autoRefresh: false
};

jest.mock('in-stores/time/config', () => {
  const originalModule = jest.requireActual('in-stores/time/config');
  return {
    ...originalModule,
    getTimeConfig: jest.fn(() => timeConfig)
  };
});

jest.mock('in-stores/navigation/hooks/useNavigation', () => {
  const originalModule = jest.requireActual('in-stores/navigation/hooks/useNavigation');
  return {
    useNavigation: jest.fn(() => {
      const originalHookReturn = originalModule.useNavigation();

      return {
        ...originalHookReturn,
        location: { pathname: '/logs', matrix: {}, query: {} }
      };
    })
  };
});

describe('LinkButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined)
      }
    });
  });

  it('clipboard should contain link when clicked', () => {
    const itemId = '12345';
    const expectedLink = `logs;selectedId=*${itemId}~?timeline.ws=86400000&timeline.to=${now}&timeline.ar=false`;

    render(<LinkButton time={1729752315022} itemId={itemId} initialLogLines={20} />);

    const copyButtonElement = screen.getByTestId('link-button');

    copyButtonElement.click();

    expect((navigator.clipboard.writeText as jest.Mock).mock.calls[0][0]).toContain(expectedLink);
  });
});
