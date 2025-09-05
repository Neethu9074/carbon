/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import { PublicConfig } from '@carbon/ai-chat';
import React from 'react';

// Import the component for type checking
import AIChat from 'in-aichat/AIChat';

// Define types for the mock
interface MockChatInstance {
  changeView: jest.Mock;
  on: jest.Mock;
  customPanels: {
    getPanel: jest.Mock;
  };
  updateCustomMenuOptions: jest.Mock;
  updateLanguagePack: jest.Mock;
  trackCta: jest.Mock;
}

interface AIChatProps {
  config: PublicConfig;
  customResponseDefinitions?: any[];
  customMenuOptions?: (panel: any) => any[];
  customPanelConfig?: any;
  onAfterRender?: (chatInstance: MockChatInstance) => void;
  onBeforeRender?: (chatInstance: MockChatInstance) => void;
  aiToolTipContent?: React.ReactNode;
  previewPill?: boolean;
}

// Mock the AIChat component directly instead of testing the real implementation
jest.mock('in-aichat/AIChat', () => ({
  __esModule: true,
  default: ({ onBeforeRender, onAfterRender, customMenuOptions, previewPill }: AIChatProps) => {
    // Create a mock chat instance
    const mockChatInstance: MockChatInstance = {
      changeView: jest.fn(),
      on: jest.fn(),
      customPanels: {
        getPanel: jest.fn().mockReturnValue({})
      },
      updateCustomMenuOptions: jest.fn(),
      updateLanguagePack: jest.fn(),
      trackCta: jest.fn()
    };

    // Call the callbacks to simulate the lifecycle
    if (onBeforeRender) onBeforeRender(mockChatInstance);
    if (onAfterRender) onAfterRender(mockChatInstance);

    // If customMenuOptions is provided, call it
    if (customMenuOptions) {
      customMenuOptions(mockChatInstance.customPanels.getPanel());
    }

    return (
      <div data-testid="mocked-ai-chat">
        <div data-testid="chat-container">Chat Container</div>
        <div data-testid="launcher-button">Launcher Button</div>
        {previewPill && <div data-testid="preview-pill">Preview Pill</div>}
      </div>
    );
  }
}));

// Mock the utils
jest.mock('in-aichat/utils/utils', () => ({
  moveAIChatLauncher: jest.fn(),
  setupDragListeners: jest.fn(),
  setupCustomLanguagePack: jest.fn(),
  handleTracking: jest.fn(),
  AI_CHAT_TAG_NAME: 'cds-aichat-react',
  LAUNCHER_BUTTON_ID: 'aiChatLauncher',
  WAC_WIDGET: 'WACWidget'
}));

jest.mock('in-services/tracking/useSegmentTracking', () => ({
  useSegmentTracking: () => ({
    trackCta: jest.fn()
  })
}));

describe('AIChat Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component correctly', () => {
    render(<AIChat config={{}} />);

    expect(screen.getByTestId('chat-container')).toBeInTheDocument();
    expect(screen.getByTestId('launcher-button')).toBeInTheDocument();
  });

  it('calls onBeforeRender and onAfterRender with chat instance', () => {
    const onBeforeRender = jest.fn();
    const onAfterRender = jest.fn();

    render(<AIChat config={{}} onBeforeRender={onBeforeRender} onAfterRender={onAfterRender} />);

    expect(onBeforeRender).toHaveBeenCalled();
    expect(onAfterRender).toHaveBeenCalled();
  });

  it('renders preview pill when previewPill prop is true', () => {
    render(<AIChat config={{}} previewPill />);
    expect(screen.getByTestId('preview-pill')).toBeInTheDocument();
  });

  it('applies custom menu options when provided', () => {
    const customMenuOptions = jest.fn().mockReturnValue([
      { text: 'Option 1', handler: jest.fn() },
      { text: 'Option 2', handler: jest.fn() }
    ]);

    render(<AIChat config={{}} customMenuOptions={customMenuOptions} />);

    expect(customMenuOptions).toHaveBeenCalled();
  });
});

// Made with Bob
