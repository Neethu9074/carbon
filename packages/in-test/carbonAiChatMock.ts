/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

/* eslint-env node */

// Mock for @carbon/ai-chat

// Define types for the mock
interface Messaging {
  addMessage: jest.Mock;
  removeMessages: jest.Mock;
}

interface ChatInstanceType {
  messaging: Messaging;
  updateAssistantInputFieldVisibility: jest.Mock;
  updateCSSVariables: jest.Mock;
  updateIsTypingCounter: jest.Mock;
  on: jest.Mock;
}

class ChatInstance implements ChatInstanceType {
  messaging: Messaging;
  updateAssistantInputFieldVisibility: jest.Mock;
  updateCSSVariables: jest.Mock;
  updateIsTypingCounter: jest.Mock;
  on: jest.Mock;

  constructor() {
    this.messaging = {
      addMessage: jest.fn(),
      removeMessages: jest.fn()
    };
    this.updateAssistantInputFieldVisibility = jest.fn();
    this.updateCSSVariables = jest.fn();
    this.updateIsTypingCounter = jest.fn();
    this.on = jest.fn();
  }
}

class ChatContainer {}
class PublicConfig {}

// Constants
const MessageResponseTypes = {
  TEXT: 'text',
  USER_DEFINED: 'user_defined',
  OPTION: 'option',
  SEARCH: 'search'
} as const;

const AgentMessageType = {
  INLINE_ERROR: 'inline_error',
  THINKING: 'thinking'
} as const;

const BusEventType = {
  VIEW_CHANGE: 'view:change'
} as const;

const ViewType = {
  MAIN_WINDOW: 'main_window'
} as const;

// Export all components and constants
export { MessageResponseTypes, AgentMessageType, BusEventType, ViewType, ChatInstance, ChatContainer, PublicConfig };

// Made with Bob
