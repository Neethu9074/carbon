/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import { shallow } from 'enzyme';
import React from 'react';

import GroupByKeyValue, {
  getLabel,
  getByTitle
} from 'in-alerting/smart-alerts/applications/tearSheet/components/Grouping/GroupByKeyValue';

jest.mock('in-applications/subscriptions/getApplication', () => {
  const { just } = jest.requireActual('@instana/observables');
  return {
    __esModule: true,
    default: jest.fn(() => just('application.id'))
  };
});

jest.mock('in-applications/subscriptions/getServiceLabel', () => {
  const { just } = jest.requireActual('@instana/observables');
  return {
    __esModule: true,
    default: jest.fn(() => just('service.id'))
  };
});

jest.mock('in-applications/subscriptions/getEndpointInfo', () => {
  const { just } = jest.requireActual('@instana/observables');
  return {
    __esModule: true,
    default: jest.fn(() => just('endpoint.id'))
  };
});

describe('in-alerting/smart-alerts/applications/tearSheet/components/Grouping/GroupByKeyValue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = propOverrides => {
    const props = Object.assign(
      {
        label: 'test label',
        groupbyTag: 'service.id'
      },
      propOverrides
    );

    const wrapper = shallow(<GroupByKeyValue {...props} />);

    return {
      wrapper,
      props
    };
  };

  describe('test GroupByKeyValue', () => {
    it('renders without crashing', () => {
      const { wrapper } = setup();
      expect(wrapper.exists()).toBe(true);
    });

    it('renders with application.id', () => {
      render(<GroupByKeyValue groupbyTag="application.id" label="test" />);
    });

    it('renders with service.id', () => {
      render(<GroupByKeyValue groupbyTag="service.id" label="test" />);
    });

    it('renders with endpoint.id', () => {
      render(<GroupByKeyValue groupbyTag="endpoint.id" label="test" />);
    });
  });

  describe('test getLabel', () => {
    test('getLabel returns the label from the result data if it exists', () => {
      const result = {
        data: {
          label: 'Test Label'
        }
      };
      expect(getLabel(result)).toBe('Test Label');
    });
  });

  describe('test getByTitle', () => {
    it('returns "Application.name" when given "application.id"', () => {
      expect(getByTitle('application.id')).toBe('Application.name');
    });

    it('returns "Service.name" when given "service.id"', () => {
      expect(getByTitle('service.id')).toBe('Service.name');
    });

    it('returns "Endpoint.name" when given "endpoint.id"', () => {
      expect(getByTitle('endpoint.id')).toBe('Endpoint.name');
    });
  });
});
