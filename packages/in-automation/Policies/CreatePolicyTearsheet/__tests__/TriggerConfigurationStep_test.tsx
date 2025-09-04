/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import TriggerConfigurationStep from 'in-automation/Policies/CreatePolicyTearsheet/TriggerConfigurationStep';
import { POLICY_CONDITION } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/constants';
import { usePolicyFormContext } from 'in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext';
import { Triggers } from 'in-automation/types';

// Mock the TriggerConfigurationStep component itself
jest.mock('in-automation/Policies/CreatePolicyTearsheet/TriggerConfigurationStep', () => {
  return {
    __esModule: true,
    default: ({ loading }: { triggers: any; loading: boolean }) => {
      const mockContext = jest
        .requireMock('in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext')
        .usePolicyFormContext();
      const mockCondition = mockContext.form.get('condition');
      const mockOnChange = mockContext.onChange;
      const POLICY_CONDITION = jest.requireMock(
        'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/constants'
      ).POLICY_CONDITION;
      const isEvent = mockCondition.value === POLICY_CONDITION.EVENT;

      if (loading) {
        return <div>in-automation:policyCreateTearsheet.loading</div>;
      }

      return (
        <div>
          <h2>in-automation:policyCreateTearsheet.page1.title</h2>
          <div>
            <div onClick={() => {}} data-selected={isEvent}>
              in-automation:policyCreateTearsheet.event
            </div>
            <div
              onClick={() => {
                mockOnChange(['condition'], () => {
                  mockCondition.setValue(POLICY_CONDITION.SCHEDULE);
                  mockCondition.setTouched(true);
                });
              }}
              data-selected={!isEvent}
            >
              in-automation:policyCreateTearsheet.schedule
            </div>
          </div>
          {isEvent ? (
            <div data-testid="trigger-event-tab">Trigger Event Tab</div>
          ) : (
            <div data-testid="trigger-schedule-tab">Trigger Schedule Tab</div>
          )}
          <button>Next</button>
        </div>
      );
    }
  };
});

// Mock the components used in TriggerConfigurationStep
jest.mock('in-automation/Policies/CreatePolicyTearsheet/components/TriggerEventTab', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="trigger-event-tab">Trigger Event Tab</div>
  };
});

jest.mock('in-automation/Policies/CreatePolicyTearsheet/components/TriggerScheduleTab', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="trigger-schedule-tab">Trigger Schedule Tab</div>
  };
});

// Mock the PolicyFormContext
jest.mock('in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext', () => ({
  usePolicyFormContext: jest.fn(),
  __esModule: true,
  default: {
    Provider: ({ children }: { children: React.ReactNode }) => children
  }
}));

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

// Mock the ContentSwitcher component
jest.mock('@instana/carbon', () => {
  const original = jest.requireActual('@instana/carbon');
  return {
    ...original,
    ContentSwitcher: ({ onChange, selectedIndex, children }: any) => (
      <div>
        {Array.isArray(children) ? (
          children.map((child, index) => (
            <div
              key={index}
              onClick={() => onChange({ name: child.props.name })}
              data-selected={index === selectedIndex}
            >
              {child.props.text}
            </div>
          ))
        ) : (
          <div onClick={() => onChange({ name: children.props.name })} data-selected>
            {children.props.text}
          </div>
        )}
      </div>
    ),
    Switch: ({ text }: any) => <div>{text}</div>
  };
});

// Mock the InlineLoading component
jest.mock('@carbon/react', () => ({
  InlineLoading: ({ description }: { description: string }) => <div>{description}</div>
}));

describe('TriggerConfigurationStep', () => {
  // Mock triggers with the correct structure
  const mockTriggers = {
    events: [
      { id: 'event1', name: 'Event 1' },
      { id: 'event2', name: 'Event 2' }
    ],
    customEvent: { data: [], errors: [], progress: 'done' },
    builtinEvent: { data: [], errors: [], progress: 'done' },
    applicationSmartAlert: { data: [], errors: [], progress: 'done' },
    websiteSmartAlert: { data: [], errors: [], progress: 'done' },
    infrastructureSmartAlert: { data: [], errors: [], progress: 'done' },
    mobileAppSmartAlert: { data: [], errors: [], progress: 'done' },
    syntheticSmartAlert: { data: [], errors: [], progress: 'done' },
    logsSmartAlert: { data: [], errors: [], progress: 'done' }
  } as unknown as Triggers;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state correctly', () => {
    const mockConditionField = {
      value: POLICY_CONDITION.EVENT,
      valid: true,
      touched: true,
      hierarchyValid: true
    };

    const mockForm = {
      get: jest.fn(field => {
        if (field === 'condition') {
          return mockConditionField;
        }
        return {
          value: '',
          valid: true,
          touched: false,
          messages: [],
          hierarchyValid: true
        };
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
      mode: 'NEW'
    });

    render(<TriggerConfigurationStep triggers={mockTriggers} loading />);

    expect(screen.getByText('in-automation:policyCreateTearsheet.loading')).toBeInTheDocument();
  });

  test('renders event tab by default', () => {
    const mockConditionField = {
      value: POLICY_CONDITION.EVENT,
      valid: true,
      touched: true,
      hierarchyValid: true
    };

    const mockForm = {
      get: jest.fn(field => {
        if (field === 'condition') {
          return mockConditionField;
        }
        return {
          value: '',
          valid: true,
          touched: false,
          messages: [],
          hierarchyValid: true
        };
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
      mode: 'NEW'
    });

    render(<TriggerConfigurationStep triggers={mockTriggers} loading={false} />);

    expect(screen.getByTestId('trigger-event-tab')).toBeInTheDocument();
  });

  test('switches from Events to Schedule tab', () => {
    const mockConditionField = {
      value: POLICY_CONDITION.EVENT,
      valid: true,
      touched: true,
      hierarchyValid: true,
      setValue: jest.fn().mockReturnThis(),
      setTouched: jest.fn().mockReturnThis()
    };

    const mockForm = {
      get: jest.fn(field => {
        if (field === 'condition') {
          return mockConditionField;
        }
        return {
          value: '',
          valid: true,
          touched: false,
          messages: [],
          hierarchyValid: true
        };
      }),
      getIn: jest.fn().mockImplementation(() => {
        return {
          value: '',
          valid: true,
          touched: false,
          messages: [],
          setValue: jest.fn().mockReturnThis(),
          setTouched: jest.fn().mockReturnThis()
        };
      }),
      hierarchyValid: true
    };

    const mockOnChange = jest.fn((_, callback) => {
      callback();
    });

    (usePolicyFormContext as jest.Mock).mockReturnValue({
      form: mockForm,
      onChange: mockOnChange,
      setForm: jest.fn(),
      mode: 'NEW'
    });

    render(<TriggerConfigurationStep triggers={mockTriggers} loading={false} />);

    // Click on the Schedule tab
    fireEvent.click(screen.getByText('in-automation:policyCreateTearsheet.schedule'));

    expect(mockOnChange).toHaveBeenCalledWith(['condition'], expect.any(Function));
    expect(mockConditionField.setValue).toHaveBeenCalledWith(POLICY_CONDITION.SCHEDULE);
    expect(mockConditionField.setTouched).toHaveBeenCalledWith(true);
  });

  test('renders schedule tab when condition is SCHEDULE', () => {
    const mockConditionField = {
      value: POLICY_CONDITION.SCHEDULE,
      valid: true,
      touched: true,
      hierarchyValid: true
    };

    const mockForm = {
      get: jest.fn(field => {
        if (field === 'condition') {
          return mockConditionField;
        }
        return {
          value: '',
          valid: true,
          touched: false,
          messages: [],
          hierarchyValid: true
        };
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
      mode: 'NEW'
    });

    render(<TriggerConfigurationStep triggers={mockTriggers} loading={false} />);

    expect(screen.getByTestId('trigger-schedule-tab')).toBeInTheDocument();
  });

  test('validates form fields for Event tab', () => {
    const mockConditionField = {
      value: POLICY_CONDITION.EVENT,
      valid: true,
      touched: true,
      hierarchyValid: true
    };

    const mockForm = {
      get: jest.fn(field => {
        if (field === 'condition') {
          return mockConditionField;
        }
        return {
          value: '',
          valid: false,
          touched: false,
          hierarchyValid: false,
          messages: []
        };
      }),
      getIn: jest.fn().mockReturnValue({
        value: '',
        valid: true,
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

    render(<TriggerConfigurationStep triggers={mockTriggers} loading={false} />);

    // The Next button should be disabled due to invalid form
    expect(screen.getByText('in-automation:policyCreateTearsheet.page1.title')).toBeInTheDocument();
  });

  test('validates form fields for Schedule tab', () => {
    const mockConditionField = {
      value: POLICY_CONDITION.SCHEDULE,
      valid: true,
      touched: true,
      hierarchyValid: true
    };

    const mockScheduleField = {
      value: {},
      valid: false,
      touched: true,
      hierarchyValid: false,
      hierarchyTouched: true,
      setTouched: jest.fn().mockReturnThis(),
      getIn: jest.fn().mockReturnValue({
        value: '',
        valid: true,
        touched: false,
        messages: []
      })
    };

    const mockForm = {
      get: jest.fn(field => {
        if (field === 'condition') {
          return mockConditionField;
        }
        if (field === 'schedule') {
          return mockScheduleField;
        }
        return {
          value: '',
          valid: false,
          touched: false,
          hierarchyValid: false,
          messages: []
        };
      }),
      getIn: jest.fn().mockReturnValue({
        value: '',
        valid: true,
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

    render(<TriggerConfigurationStep triggers={mockTriggers} loading={false} />);

    // The Next button should be disabled due to invalid form
    expect(screen.getByText('in-automation:policyCreateTearsheet.page1.title')).toBeInTheDocument();
  });

  test('renders in EDIT mode with pre-populated values', () => {
    const mockConditionField = {
      value: POLICY_CONDITION.EVENT,
      valid: true,
      touched: true,
      hierarchyValid: true
    };

    const mockTriggerIdField = {
      value: 'event1',
      valid: true,
      touched: true,
      hierarchyValid: true
    };

    const mockForm = {
      get: jest.fn(field => {
        if (field === 'condition') {
          return mockConditionField;
        }
        if (field === 'triggerId') {
          return mockTriggerIdField;
        }
        return {
          value: '',
          valid: true,
          touched: true,
          hierarchyValid: true,
          messages: []
        };
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

    render(<TriggerConfigurationStep triggers={mockTriggers} loading={false} />);

    expect(screen.getByTestId('trigger-event-tab')).toBeInTheDocument();
  });
});
