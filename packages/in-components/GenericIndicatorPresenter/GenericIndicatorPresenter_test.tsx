/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 *
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import GenericIndicatorPresenter from 'in-components/GenericIndicatorPresenter/GenericIndicatorPresenter';

// Mock the dependencies
jest.mock('@instana/carbon', () => ({
  Popover: ({ children, open, ref, ...props }: any) => (
    <div data-testid="mock-popover" ref={ref} data-open={open} {...props}>
      {children}
    </div>
  ),
  PopoverContent: ({ children }: any) => <div data-testid="mock-popover-content">{children}</div>
}));

jest.mock('@instana/components', () => ({
  AutoReposition: ({ children }: any) => <div data-testid="mock-auto-reposition">{children}</div>
}));

jest.mock('in-hooks/usePopoverClickHandler', () => {
  return jest.fn(() => ({
    open: false,
    toggle: jest.fn(),
    ref: { current: null }
  }));
});

// Mock components for testing
const MockIndicator = (props: any) => {
  const {onClick, isOpen, testProp} = props;

  return (
    <button data-testid="mock-indicator" onClick={onClick} data-is-open={isOpen} data-in-indicator={testProp}>
      Indicator
    </button>);
};

const MockContent = (props: any) => {
  const {inContentArea} = props;
  return (
    <div data-testid="mock-content" data-in-content-area={inContentArea}>
      Content
    </div>
  );
};

const mockToggle = jest.fn();

describe('GenericIndicatorPresenter', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    // Update the mock implementation for each test
    require('in-hooks/usePopoverClickHandler').mockImplementation(() => ({
      open: false,
      toggle: mockToggle,
      ref: { current: null }
    }));
  });

  it('renders the indicator component', () => {
    render(
      <GenericIndicatorPresenter
        IndicatorPresenter={MockIndicator}
        Content={MockContent}
        indicatorProps={{}}
        contentProps={{}}
        inContentArea={false}
      />
    );

    expect(screen.getByTestId('mock-indicator')).toBeInTheDocument();
    expect(screen.getByText('Indicator')).toBeInTheDocument();
  });

  it('passes props to the indicator component', () => {
    render(
      <GenericIndicatorPresenter
        IndicatorPresenter={MockIndicator}
        Content={MockContent}
        indicatorProps={{ testProp: 'test' }}
        contentProps={{}}
        inContentArea={false}
      />
    );

    expect(screen.getByTestId('mock-indicator')).toBeInTheDocument();
    expect(screen.getByTestId('mock-indicator')).toHaveAttribute('data-in-indicator', 'test');

  });

  it('uses AutoReposition when not in content area', () => {
    render(
      <GenericIndicatorPresenter
        IndicatorPresenter={MockIndicator}
        Content={MockContent}
        indicatorProps={{}}
        contentProps={{}}
        inContentArea={false}
      />
    );

    expect(screen.getByTestId('mock-auto-reposition')).toBeInTheDocument();
  });

  it('does not use AutoReposition when in content area', () => {
    render(
      <GenericIndicatorPresenter
        IndicatorPresenter={MockIndicator}
        Content={MockContent}
        indicatorProps={{}}
        contentProps={{}}
        inContentArea
      />
    );

    expect(screen.queryByTestId('mock-auto-reposition')).not.toBeInTheDocument();
  });

  it('calls toggle function when indicator is clicked', () => {
    render(
      <GenericIndicatorPresenter
        IndicatorPresenter={MockIndicator}
        Content={MockContent}
        indicatorProps={{}}
        contentProps={{}}
        inContentArea={false}
      />
    );

    fireEvent.click(screen.getByTestId('mock-indicator'));
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('renders content when popover is open', () => {
    // Update the mock to return open=true
    require('in-hooks/usePopoverClickHandler').mockImplementation(() => ({
      open: true,
      toggle: mockToggle,
      ref: { current: null }
    }));

    render(
      <GenericIndicatorPresenter
        IndicatorPresenter={MockIndicator}
        Content={MockContent}
        indicatorProps={{}}
        contentProps={{}}
        inContentArea={false}
      />
    );

    expect(screen.getByTestId('mock-popover')).toHaveAttribute('data-open', 'true');
    expect(screen.getByTestId('mock-content')).toBeInTheDocument();
  });

  it('passes inContentArea prop to Content component', () => {
    // Update the mock to return open=true
    require('in-hooks/usePopoverClickHandler').mockImplementation(() => ({
      open: true,
      toggle: mockToggle,
      ref: { current: null }
    }));

    render(
      <GenericIndicatorPresenter
        IndicatorPresenter={MockIndicator}
        Content={MockContent}
        indicatorProps={{}}
        contentProps={{}}
        inContentArea
      />
    );

    expect(screen.getByTestId('mock-content')).toHaveAttribute('data-in-content-area', 'true');
  });
});

// Made with Bob
