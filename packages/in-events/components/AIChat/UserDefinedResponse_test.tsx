/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import UserDefinedResponse from 'in-events/components/AIChat/UserDefinedResponse';

// Mock the custom response components
jest.mock('in-events/components/AIChat/CustomResponse/PromptLibraryResponse', () => ({
  __esModule: true,
  default: () => <div data-testid="prompt-library-response">Prompt Library Response</div>
}));

jest.mock('in-events/components/AIChat/TableComponents/TableChartSwitcher', () => ({
  __esModule: true,
  default: () => <div data-testid="table-chart-switcher">Table Chart Switcher</div>
}));

jest.mock('in-events/components/AIChat/CustomResponse/ThumbsFeedback', () => ({
  __esModule: true,
  default: () => <div data-testid="thumbs-feedback">Thumbs Feedback</div>
}));

jest.mock('in-events/components/AIChat/TableComponents/EventsTable', () => ({
  __esModule: true,
  default: () => <div data-testid="events-table">Events Table</div>
}));

jest.mock('in-events/components/AIChat/CustomResponse/TypeTextResponse', () => ({
  __esModule: true,
  default: () => <div data-testid="nlg-response">NLG Response</div>
}));

describe('UserDefinedResponse Component', () => {
  const mockInstance = {};

  it('returns null when messageItem is not provided', () => {
    const { container } = render(<UserDefinedResponse messageItem={null} instance={mockInstance} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders prompt_library response correctly', () => {
    const messageItem = {
      user_defined: {
        user_defined_type: 'prompt_library'
      }
    };

    render(<UserDefinedResponse messageItem={messageItem} instance={mockInstance} />);
    expect(screen.getByTestId('prompt-library-response')).toBeInTheDocument();
  });

  it('renders table_chart response correctly', () => {
    const messageItem = {
      user_defined: {
        user_defined_type: 'table_chart'
      }
    };

    render(<UserDefinedResponse messageItem={messageItem} instance={mockInstance} />);
    expect(screen.getByTestId('table-chart-switcher')).toBeInTheDocument();
  });

  it('renders typetext_response response correctly', () => {
    const messageItem = {
      user_defined: {
        user_defined_type: 'typetext_response'
      }
    };

    render(<UserDefinedResponse messageItem={messageItem} instance={mockInstance} />);
    expect(screen.getByTestId('nlg-response')).toBeInTheDocument();
  });

  it('renders events_table response correctly', () => {
    const messageItem = {
      user_defined: {
        user_defined_type: 'events_table'
      }
    };

    render(<UserDefinedResponse messageItem={messageItem} instance={mockInstance} />);
    expect(screen.getByTestId('events-table')).toBeInTheDocument();
  });

  it('renders thumbs_feedback response correctly', () => {
    const messageItem = {
      user_defined: {
        user_defined_type: 'thumbs_feedback',
        posTrack: 'positive_feedback',
        negTrack: 'negative_feedback',
        additionalInfo: { key: 'value' }
      }
    };

    render(<UserDefinedResponse messageItem={messageItem} instance={mockInstance} />);
    expect(screen.getByTestId('thumbs-feedback')).toBeInTheDocument();
  });

  it('renders custom response when customResponseDefinitions is provided', () => {
    const messageItem = {
      user_defined: {
        user_defined_type: 'custom_type'
      }
    };

    const customResponseDefinitions = [
      {
        key: 'custom_type',
        handler: () => <div data-testid="custom-response">Custom Response</div>
      }
    ];

    render(
      <UserDefinedResponse
        messageItem={messageItem}
        instance={mockInstance}
        customResponseDefinitions={customResponseDefinitions}
      />
    );

    expect(screen.getByTestId('custom-response')).toBeInTheDocument();
  });

  it('returns undefined for unknown response type', () => {
    const messageItem = {
      user_defined: {
        user_defined_type: 'unknown_type'
      }
    };

    const { container } = render(<UserDefinedResponse messageItem={messageItem} instance={mockInstance} />);
    expect(container.firstChild).toBeNull();
  });
});

// Made with Bob
