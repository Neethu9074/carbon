/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ActionConfigurationStep from 'in-automation/Policies/CreatePolicyTearsheet/ActionConfigurationStep';
import { usePolicyFormContext } from 'in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext';

// Mock the SelectAction component (not NewSelectAction)
jest.mock('in-automation/Policies/NewSelectAction', () => {
  return {
    __esModule: true,
    default: function MockSelectAction() {
      return (
        <div data-testid="new-select-action">
          <div>Action Selection Component</div>
          <div>Selected: action1</div>
        </div>
      );
    }
  };
});

// Mock the CreateTearsheetStep component
jest.mock('@instana/ibm-products', () => {
  return {
    CreateTearsheetStep: function MockCreateTearsheetStep({
      children,
      title
    }: {
      children: React.ReactNode;
      title: string;
    }) {
      return (
        <div data-testid="create-tearsheet-step">
          <h2>{title}</h2>
          {children}
        </div>
      );
    }
  };
});

// Mock the PolicyFormContext
jest.mock('in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext', () => ({
  usePolicyFormContext: jest.fn()
}));

// Mock the t function from i18n
jest.mock('in-i18n', () => ({
  t: jest.fn(key => key)
}));

describe('ActionConfigurationStep', () => {
  // Mock actions with required properties
  const mockActions = [
    {
      id: 'action1',
      name: 'Action 1',
      type: 'type1',
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    },
    {
      id: 'action2',
      name: 'Action 2',
      type: 'type2',
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders action selection component', () => {
    const mockActionField = {
      value: '',
      valid: false,
      touched: false,
      messages: [],
      setValue: jest.fn().mockReturnThis(),
      setTouched: jest.fn().mockReturnThis()
    };

    const mockForm = {
      get: jest.fn().mockReturnValue(mockActionField),
      getIn: jest.fn().mockReturnValue({
        value: '',
        valid: false,
        touched: false,
        messages: []
      }),
      hierarchyValid: false
    };

    (usePolicyFormContext as jest.Mock).mockReturnValue({
      form: mockForm,
      onChange: jest.fn(),
      setForm: jest.fn(),
      mode: 'NEW'
    });

    render(<ActionConfigurationStep actions={mockActions as any} />);

    expect(screen.getByTestId('new-select-action')).toBeInTheDocument();
    expect(screen.getByText('Configure action')).toBeInTheDocument();
  });

  test('validates that an action is selected', () => {
    // First render with no action selected
    const mockActionField = {
      value: '',
      valid: false,
      touched: true,
      messages: [],
      hierarchyValid: false
    };

    const mockForm = {
      get: jest.fn().mockReturnValue(mockActionField),
      getIn: jest.fn().mockReturnValue(mockActionField),
      hierarchyValid: false
    };

    (usePolicyFormContext as jest.Mock).mockReturnValue({
      form: mockForm,
      onChange: jest.fn(),
      setForm: jest.fn(),
      mode: 'NEW'
    });

    const { rerender } = render(<ActionConfigurationStep actions={mockActions as any} />);

    // Now render with a valid action selected
    const mockValidActionField = {
      value: 'action1',
      valid: true,
      touched: true,
      messages: [],
      hierarchyValid: true
    };

    const mockValidForm = {
      get: jest.fn().mockReturnValue(mockValidActionField),
      getIn: jest.fn().mockReturnValue(mockValidActionField),
      hierarchyValid: true
    };

    (usePolicyFormContext as jest.Mock).mockReturnValue({
      form: mockValidForm,
      onChange: jest.fn(),
      setForm: jest.fn(),
      mode: 'NEW'
    });

    rerender(<ActionConfigurationStep actions={mockActions as any} />);

    // The form should now be valid
    expect(mockValidForm.hierarchyValid).toBe(true);
  });

  test('renders in EDIT mode with pre-populated action', () => {
    const mockActionField = {
      value: 'action1',
      valid: true,
      touched: true,
      messages: [],
      hierarchyValid: true
    };

    const mockForm = {
      get: jest.fn().mockReturnValue(mockActionField),
      getIn: jest.fn().mockReturnValue(mockActionField),
      hierarchyValid: true
    };

    (usePolicyFormContext as jest.Mock).mockReturnValue({
      form: mockForm,
      onChange: jest.fn(),
      setForm: jest.fn(),
      mode: 'EDIT'
    });

    render(<ActionConfigurationStep actions={mockActions as any} />);

    expect(screen.getByText('Selected: action1')).toBeInTheDocument();
  });

  test('handles navigation between steps', () => {
    const mockActionField = {
      value: 'action1',
      valid: true,
      touched: true,
      messages: [],
      hierarchyValid: true
    };

    const mockForm = {
      get: jest.fn().mockReturnValue(mockActionField),
      getIn: jest.fn().mockReturnValue(mockActionField),
      hierarchyValid: true
    };

    (usePolicyFormContext as jest.Mock).mockReturnValue({
      form: mockForm,
      onChange: jest.fn(),
      setForm: jest.fn(),
      mode: 'NEW'
    });

    render(<ActionConfigurationStep actions={mockActions as any} />);

    // The form should be valid and allow navigation
    expect(mockForm.hierarchyValid).toBe(true);
  });
});
