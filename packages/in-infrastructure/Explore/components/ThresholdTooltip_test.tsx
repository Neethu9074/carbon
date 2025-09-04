/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { shallow } from 'enzyme';
import { expect } from 'chai';
import React from 'react';

import { Threshold, ThresholdOperator } from '@instana/types';

import ThresholdTooltip from 'in-infrastructure/Explore/components/ThresholdTooltip';
import { number } from 'in-services/formatters/number';

describe('ThresholdTooltip', () => {
  const formatter = number.detailed;
  const formatterId = 'number.detailed';

  const createThreshold = (overrides = {}): Threshold => ({
    thresholdEnabled: true,
    operator: '>=' as ThresholdOperator,
    critical: '90',
    warning: '80',
    ...overrides
  });

  const nullCases = [
    {
      name: 'threshold is not provided',
      threshold: null as unknown as Threshold
    },
    {
      name: 'thresholdEnabled is false',
      threshold: createThreshold({ thresholdEnabled: false })
    },
    {
      name: 'operator is not provided',
      threshold: createThreshold({ operator: undefined })
    },
    {
      name: 'both critical and warning are not provided',
      threshold: createThreshold({ critical: undefined, warning: undefined })
    },
    {
      name: 'both critical and warning are empty strings',
      threshold: createThreshold({ critical: '', warning: '' })
    },
    {
      name: 'both critical and warning are whitespace strings',
      threshold: createThreshold({ critical: '   ', warning: '  ' })
    },
    {
      name: 'thresholdEnabled is false with valid operator and empty values',
      threshold: {
        thresholdEnabled: false,
        operator: '>=' as ThresholdOperator,
        critical: '',
        warning: ''
      }
    }
  ];

  nullCases.forEach(({ name, threshold }) => {
    it(`should return null when ${name}`, () => {
      const wrapper = shallow(
        <ThresholdTooltip threshold={threshold} formatter={formatter} formatterId={formatterId} />
      );
      expect(wrapper.isEmptyRender()).to.equal(true);
    });
  });

  const renderCases = [
    {
      name: 'critical threshold only',
      threshold: createThreshold({ warning: undefined }),
      expectedTypographyCount: 2
    },
    {
      name: 'warning threshold only',
      threshold: createThreshold({ critical: undefined }),
      expectedTypographyCount: 2
    },
    {
      name: 'both critical and warning thresholds',
      threshold: createThreshold(),
      expectedTypographyCount: 3
    },
    {
      name: 'critical threshold with empty warning',
      threshold: createThreshold({ warning: '' }),
      expectedTypographyCount: 2
    },
    {
      name: 'warning threshold with empty critical',
      threshold: createThreshold({ critical: '' }),
      expectedTypographyCount: 2
    }
  ];

  renderCases.forEach(({ name, threshold, expectedTypographyCount }) => {
    it(`should render with ${name}`, () => {
      const wrapper = shallow(
        <ThresholdTooltip threshold={threshold} formatter={formatter} formatterId={formatterId} />
      );
      expect(wrapper.isEmptyRender()).to.equal(false);
      expect(wrapper.find('Typography')).to.have.lengthOf(expectedTypographyCount);
    });
  });
});
