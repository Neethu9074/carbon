/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { Event } from '@instana/types';

import EmptyState from './EmptyState';
import { t } from 'in-i18n';

// Mock the CreatePolicyButton component
jest.mock('./CreatePolicyButton', () => {
  return {
    __esModule: true,
    default: jest.fn(() => <button data-testid="create-policy-button">Create Policy</button>)
  };
});

// Mock the CSS module
jest.mock('./EmptyState.mless', () => ({
  emptyRecomendedActions: 'emptyRecomendedActions',
  emptyStateContent: 'emptyStateContent',
  emptyStateSubtitle: 'emptyStateSubtitle'
}));

describe('EmptyState', () => {
  const mockEvent: Event = {
    id: 'eventId',
    metadata: {},
    problem: {
      fixSuggestion: 'cpu load',
      id: 'RDdBuOyLQn-pJxt3wIvcVw',
      problemText: 'cpu load is 100%',
      severity: 10
    },
    end: 0,
    entityId: 'entity123',
    plugin: '',
    start: 0,
    state: '',
    type: ''
  };

  const mockTogglePolicyTearsheet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state with correct icon', () => {
    render(<EmptyState event={mockEvent} togglePolicyTearsheet={mockTogglePolicyTearsheet} />);

    // Check for the empty state icon
    const svgIcon = document.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
  });

  it('renders empty state with correct heading', () => {
    render(<EmptyState event={mockEvent} togglePolicyTearsheet={mockTogglePolicyTearsheet} />);

    // Check for the heading text
    expect(screen.getByText(t('in-automation:emptyRecommendedActions'))).toBeInTheDocument();
  });

  it('renders empty state with correct description texts', () => {
    render(<EmptyState event={mockEvent} togglePolicyTearsheet={mockTogglePolicyTearsheet} />);

    expect(screen.getByText(t('in-automation:emptyRecommendedActionsDescription1'))).toBeInTheDocument();
  });

  it('renders CreatePolicyButton with correct props', () => {
    render(<EmptyState event={mockEvent} togglePolicyTearsheet={mockTogglePolicyTearsheet} />);

    expect(screen.getByTestId('create-policy-button')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<EmptyState event={mockEvent} togglePolicyTearsheet={mockTogglePolicyTearsheet} />);

    // Check for the main container class
    expect(container.firstChild).toHaveClass('emptyRecomendedActions');

    // Check for the content container class
    const contentContainer = container.querySelector('.emptyStateContent');
    expect(contentContainer).toBeInTheDocument();

    // Check for the subtitle classes
    const subtitles = container.querySelectorAll('.emptyStateSubtitle');
    expect(subtitles.length).toBe(2);
  });
});
