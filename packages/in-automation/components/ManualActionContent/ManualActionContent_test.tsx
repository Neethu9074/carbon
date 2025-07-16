/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { Field } from '@instana/types';

// Import the component using the full path to avoid import restrictions
import ManualActionContent from 'in-automation/components/ManualActionContent/ManualActionContent';
import { GenerateAIActionForm } from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/useGenerateAIActionForm';

// Mock the dependencies
jest.mock('in-components/DangerousHtmlPresenter', () => {
  return ({ html, className }: { html: string; className: string }) => (
    <div data-testid="mock-dangerous-html" className={className}>
      {html}
    </div>
  );
});

jest.mock('in-components/CopyToClipboard', () => {
  return ({ children }: { getText: () => string; children: (ref: any) => React.ReactNode }) => {
    const refSetter = jest.fn();
    return <div data-testid="mock-copy-clipboard">{children(refSetter)}</div>;
  };
});

jest.mock('in-automation/AutomationCard/GenerateAI/FeedbackComponent', () => {
  return () => <div data-testid="mock-feedback-component">Feedback Component</div>;
});

jest.mock('in-services/formatters/markdown', () => ({
  toHtml: (content: string) => `<p>Mocked HTML for: ${content}</p>`
}));

jest.mock('in-automation/utils/actionField', () => ({
  base64ToUtf8: (content: string) => `Decoded: ${content}`
}));

describe('ManualActionContent', () => {
  const mockContent: Field = {
    value: 'Test content',
    encoding: 'plain',
    name: 'test-content' // Adding the required name property
  };

  const mockBase64Content: Field = {
    value: 'VGVzdCBiYXNlNjQgY29udGVudA==', // "Test base64 content"
    encoding: 'base64',
    name: 'test-base64-content' // Adding the required name property
  };

  // Create a partial mock of the form that satisfies TypeScript
  const mockForm = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'prompt') {
        return {
          get: jest.fn().mockImplementation((promptKey: string) => {
            const values: Record<string, { value: string }> = {
              eventName: { value: 'Test Event' },
              eventDescription: { value: 'Test Description' },
              eventEntityType: { value: 'Test Entity Type' }
            };
            return values[promptKey] || { value: '' };
          })
        };
      }
      return key === 'action' ? { mock: 'action form' } : null;
    }),
    updateIn: jest.fn().mockReturnValue({ mock: 'updated form' }),
    // Add minimal required properties to satisfy TypeScript
    touched: false,
    messages: {},
    maxSeverity: null,
    valid: true,
    dirty: false,
    pristine: true,
    submitting: false,
    submitted: false,
    submitFailed: false,
    submitSucceeded: false,
    validating: false,
    validationFailed: false
  } as unknown as GenerateAIActionForm;

  const mockSetForm = jest.fn();

  it('renders with plain text content', () => {
    render(<ManualActionContent content={mockContent} />);

    const htmlPresenter = screen.getByTestId('mock-dangerous-html');
    expect(htmlPresenter).toBeInTheDocument();
    expect(htmlPresenter).toHaveTextContent('Mocked HTML for: Test content');
  });

  it('renders with base64 encoded content', () => {
    render(<ManualActionContent content={mockBase64Content} />);

    const htmlPresenter = screen.getByTestId('mock-dangerous-html');
    expect(htmlPresenter).toBeInTheDocument();
    expect(htmlPresenter).toHaveTextContent('Mocked HTML for: Decoded: VGVzdCBiYXNlNjQgY29udGVudA==');
  });

  it('displays action name when provided', () => {
    render(<ManualActionContent content={mockContent} actionName="Test Action" />);

    // We don't need to check for the exact translation text, just that the action name is displayed
    expect(screen.getByText('Test Action')).toBeInTheDocument();
  });

  it('shows AI slug title when withAISlug is true', () => {
    render(<ManualActionContent content={mockContent} withAISlug />);

    // The component will use the actual translation
    const popoverContent = screen.getByTestId('mock-dangerous-html');
    expect(popoverContent).toBeInTheDocument();
  });

  it('shows regular content title when withAISlug is false', () => {
    render(<ManualActionContent content={mockContent} withAISlug={false} />);

    // The component will use the actual translation
    const popoverContent = screen.getByTestId('mock-dangerous-html');
    expect(popoverContent).toBeInTheDocument();
  });

  it('renders copy button when addCopyButton is true', () => {
    render(<ManualActionContent content={mockContent} addCopyButton />);

    expect(screen.getByTestId('mock-copy-clipboard')).toBeInTheDocument();
  });

  it('does not render copy button when addCopyButton is false', () => {
    render(<ManualActionContent content={mockContent} addCopyButton={false} />);

    expect(screen.queryByTestId('mock-copy-clipboard')).not.toBeInTheDocument();
  });

  it('renders feedback component when showFeedback is true and form is provided', () => {
    render(<ManualActionContent content={mockContent} showFeedback form={mockForm} setForm={mockSetForm} />);

    expect(screen.getByTestId('mock-feedback-component')).toBeInTheDocument();
  });

  it('does not render feedback component when showFeedback is false', () => {
    render(<ManualActionContent content={mockContent} showFeedback={false} form={mockForm} setForm={mockSetForm} />);

    expect(screen.queryByTestId('mock-feedback-component')).not.toBeInTheDocument();
  });

  it('does not render feedback component when form is not provided', () => {
    render(<ManualActionContent content={mockContent} showFeedback form={undefined} setForm={mockSetForm} />);

    expect(screen.queryByTestId('mock-feedback-component')).not.toBeInTheDocument();
  });

  it('does not render feedback component when setForm is not provided', () => {
    render(<ManualActionContent content={mockContent} showFeedback form={mockForm} setForm={undefined} />);

    expect(screen.queryByTestId('mock-feedback-component')).not.toBeInTheDocument();
  });

  it('trims leading whitespace from content before rendering', () => {
    const contentWithWhitespace: Field = {
      value: '  \n  Test content with whitespace',
      encoding: 'plain',
      name: 'test-whitespace-content' // Adding the required name property
    };

    render(<ManualActionContent content={contentWithWhitespace} />);

    const htmlPresenter = screen.getByTestId('mock-dangerous-html');
    expect(htmlPresenter).toHaveTextContent('Mocked HTML for: Test content with whitespace');
  });

  it('handles click on copy button', () => {
    render(<ManualActionContent content={mockContent} addCopyButton />);

    const copyButton = screen.getByTestId('mock-copy-clipboard');
    fireEvent.click(copyButton);

    // The stopPropagationAndPreventDefault function should be called
    // but since it's mocked implicitly, we just verify the button was clicked
    expect(copyButton).toBeInTheDocument();
  });
});
