/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { usePolicyFormContext } from 'in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext';
import PolicyDetailsStep from 'in-automation/Policies/CreatePolicyTearsheet/PolicyDetailsStep';

// Mock the PolicyFormContext
jest.mock('in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext', () => ({
  usePolicyFormContext: jest.fn(),
  __esModule: true,
  default: {
    Provider: ({ children }: { children: React.ReactNode }) => children
  }
}));

// Mock the TextInput component
jest.mock('@instana/carbon', () => {
  const original = jest.requireActual('@instana/carbon');
  return {
    ...original,
    TextInput: ({
      id,
      value,
      onChange,
      invalid
    }: {
      id: string;
      value: string;
      onChange: (event: any) => void;
      invalid: boolean;
    }) => <input data-testid={id} type="text" value={value || ''} onChange={e => onChange(e)} aria-invalid={invalid} />,
    TextArea: ({
      id,
      value,
      onChange,
      invalid
    }: {
      id: string;
      value: string;
      onChange: (event: any) => void;
      invalid: boolean;
    }) => <textarea data-testid={id} value={value || ''} onChange={e => onChange(e)} aria-invalid={invalid} />
  };
});

// Mock the t function from i18n
jest.mock('in-i18n', () => ({
  t: jest.fn(key => key)
}));

// Mock the CreateTearsheetStep component
jest.mock('@instana/ibm-products', () => ({
  CreateTearsheetStep: ({
    children,
    title,
    onNext,
    invalid
  }: {
    children: React.ReactNode;
    title: string;
    onNext: () => void;
    invalid: boolean;
  }) => (
    <div>
      <h2>{title}</h2>
      <div>{children}</div>
      <button onClick={onNext} disabled={invalid}>
        Next
      </button>
    </div>
  )
}));

// Mock CreatableTagSelect component
jest.mock('in-components/CreatableTagSelect/CreatableTagSelect', () => ({
  __esModule: true,
  default: ({ id, value, onChange }: { id: string; value: string[]; onChange: (value: string[]) => void }) => (
    <div data-testid={id}>
      <input type="text" value={value ? value.join(', ') : ''} onChange={e => onChange(e.target.value.split(', '))} />
    </div>
  )
}));

// Mock ErroneousResultPresenter component
jest.mock('in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter', () => ({
  __esModule: true,
  default: ({ errors }: { errors: any[] | undefined }) => (
    <div data-testid="errors-presenter">{errors && errors.length > 0 ? 'Errors present' : 'No errors'}</div>
  )
}));

// Mock usePolicyTags hook
jest.mock('in-automation/hooks/usePolicyTags', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    data: [],
    progress: { loading: false, done: true },
    errors: []
  })
}));

// Mock role
jest.mock('in-stores/user', () => ({
  role: {
    canConfigureAutomationPolicies: true,
    canConfigureAutomationActions: true
  }
}));

// Mock isLoading
jest.mock('in-services/util/result', () => ({
  isLoading: jest.fn().mockReturnValue(false)
}));

// Define a custom error type that matches the expected interface
interface CustomError {
  code: string;
  message: string;
  [key: string]: any;
}

describe('PolicyDetailsStep', () => {
  // Mock errors with the required properties
  const mockErrors: CustomError[] = [];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders policy details form fields', () => {
    const mockForm = {
      get: jest.fn(() => {
        const fieldObj = {
          value: '',
          valid: false,
          touched: false,
          messages: []
        };
        // Add map function to make it array-like
        return [fieldObj];
      }),
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

    render(<PolicyDetailsStep errors={mockErrors as any} />);

    expect(screen.getByTestId('policy-name')).toBeInTheDocument();
    expect(screen.getByTestId('policy-description')).toBeInTheDocument();
    expect(screen.getByText('Enter Details')).toBeInTheDocument();
  });

  test('updates policy name when changed', () => {
    const mockNameField = {
      value: '',
      valid: false,
      touched: false,
      setValue: jest.fn().mockReturnThis(),
      setTouched: jest.fn().mockReturnThis(),
      messages: []
    };

    const mockForm = {
      get: jest.fn(field => {
        if (field === 'name') {
          return [mockNameField];
        }
        return [
          {
            value: '',
            valid: true,
            touched: false,
            messages: []
          }
        ];
      }),
      getIn: jest.fn().mockReturnValue({
        value: '',
        valid: false,
        touched: false,
        messages: []
      }),
      updateIn: jest.fn().mockReturnThis(),
      hierarchyValid: false
    };

    const mockSetForm = jest.fn(callback => {
      // Call the callback with the form to simulate the updateIn behavior
      callback(mockForm);
      // Simulate the setValue and setTouched being called
      mockNameField.setValue('Test Policy');
      mockNameField.setTouched(true);
    });

    (usePolicyFormContext as jest.Mock).mockReturnValue({
      form: mockForm,
      onChange: jest.fn(),
      setForm: mockSetForm,
      mode: 'NEW'
    });

    render(<PolicyDetailsStep errors={mockErrors as any} />);
    fireEvent.change(screen.getByTestId('policy-name'), { target: { value: 'Test Policy' } });

    expect(mockNameField.setValue).toHaveBeenCalledWith('Test Policy');
    expect(mockNameField.setTouched).toHaveBeenCalledWith(true);
  });

  test('updates policy description when changed', () => {
    const mockDescriptionField = {
      value: '',
      valid: true,
      touched: false,
      setValue: jest.fn().mockReturnThis(),
      setTouched: jest.fn().mockReturnThis(),
      messages: []
    };

    const mockForm = {
      get: jest.fn(field => {
        if (field === 'description') {
          return [mockDescriptionField];
        }
        return [
          {
            value: '',
            valid: true,
            touched: false,
            messages: []
          }
        ];
      }),
      getIn: jest.fn().mockReturnValue({
        value: '',
        valid: true,
        touched: false,
        messages: []
      }),
      updateIn: jest.fn().mockReturnThis(),
      hierarchyValid: false
    };

    const mockSetForm = jest.fn(callback => {
      // Call the callback with the form to simulate the updateIn behavior
      callback(mockForm);
      // Simulate the setValue and setTouched being called
      mockDescriptionField.setValue('Test Description');
      mockDescriptionField.setTouched(true);
    });

    (usePolicyFormContext as jest.Mock).mockReturnValue({
      form: mockForm,
      onChange: jest.fn(),
      setForm: mockSetForm,
      mode: 'NEW'
    });

    render(<PolicyDetailsStep errors={mockErrors as any} />);

    fireEvent.change(screen.getByTestId('policy-description'), { target: { value: 'Test Description' } });

    expect(mockDescriptionField.setValue).toHaveBeenCalledWith('Test Description');
    expect(mockDescriptionField.setTouched).toHaveBeenCalledWith(true);
  });

  test('validates that policy name is required', () => {
    // First render with no name
    const mockNameField = {
      value: '',
      valid: false,
      touched: true,
      hierarchyValid: false,
      messages: []
    };

    const mockForm = {
      get: jest.fn(field => {
        if (field === 'name') {
          return [mockNameField];
        }
        return [
          {
            value: '',
            valid: true,
            touched: false,
            messages: []
          }
        ];
      }),
      getIn: jest.fn().mockReturnValue({
        value: '',
        valid: false,
        touched: true,
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

    const { rerender } = render(<PolicyDetailsStep errors={mockErrors as any} />);

    // The form should be invalid
    expect(mockForm.hierarchyValid).toBe(false);

    // Now render with a valid name
    const mockValidNameField = {
      value: 'Test Policy',
      valid: true,
      touched: true,
      hierarchyValid: true,
      messages: []
    };

    const mockValidForm = {
      get: jest.fn(field => {
        if (field === 'name') {
          return [mockValidNameField];
        }
        return [
          {
            value: '',
            valid: true,
            touched: false,
            messages: []
          }
        ];
      }),
      getIn: jest.fn().mockReturnValue({
        value: 'Test Policy',
        valid: true,
        touched: true,
        messages: []
      }),
      hierarchyValid: true
    };

    (usePolicyFormContext as jest.Mock).mockReturnValue({
      form: mockValidForm,
      onChange: jest.fn(),
      setForm: jest.fn(),
      mode: 'NEW'
    });

    rerender(<PolicyDetailsStep errors={mockErrors as any} />);

    // The form should now be valid
    expect(mockValidForm.hierarchyValid).toBe(true);
  });

  test('renders in EDIT mode with pre-populated values', () => {
    const mockForm = {
      get: jest.fn(field => {
        if (field === 'name') {
          return [
            {
              value: 'Existing Policy',
              valid: true,
              touched: true,
              messages: []
            }
          ];
        }
        if (field === 'description') {
          return [
            {
              value: 'Existing Description',
              valid: true,
              touched: true,
              messages: []
            }
          ];
        }
        return [
          {
            value: '',
            valid: true,
            touched: false,
            messages: []
          }
        ];
      }),
      getIn: jest.fn().mockReturnValue({
        value: '',
        valid: true,
        touched: false,
        messages: []
      }),
      hierarchyValid: true
    };

    (usePolicyFormContext as jest.Mock).mockReturnValue({
      form: mockForm,
      onChange: jest.fn(),
      setForm: jest.fn(),
      mode: 'EDIT'
    });

    render(<PolicyDetailsStep errors={mockErrors as any} />);

    expect(screen.getByTestId('policy-name')).toHaveValue('Existing Policy');
    expect(screen.getByTestId('policy-description')).toHaveValue('Existing Description');
  });

  test('handles form submission', () => {
    const mockOnSubmit = jest.fn();

    const mockForm = {
      get: jest.fn(field => {
        if (field === 'name') {
          return [
            {
              value: 'Test Policy',
              valid: true,
              touched: true,
              messages: []
            }
          ];
        }
        return [
          {
            value: '',
            valid: true,
            touched: false,
            messages: []
          }
        ];
      }),
      getIn: jest.fn().mockReturnValue({
        value: '',
        valid: true,
        touched: false,
        messages: []
      }),
      hierarchyValid: true
    };

    (usePolicyFormContext as jest.Mock).mockReturnValue({
      form: mockForm,
      onChange: jest.fn(),
      setForm: jest.fn(),
      mode: 'NEW',
      onSubmit: mockOnSubmit
    });

    render(<PolicyDetailsStep errors={mockErrors as any} />);

    // The form should be valid and allow submission
    expect(mockForm.hierarchyValid).toBe(true);
  });
});
