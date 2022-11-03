/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import React from 'react';

import SubEntityInformation from 'in-events/components/legacy/SubEntityInformation';
import { getMetricDefinition } from 'in-sdk/metrics';

jest.mock('in-sdk/metrics/metrics', () => ({
  getMetricDefinition: jest.fn()
}));

describe('in-events/components/legacy/SubEntityInformation', () => {
  beforeEach(jest.clearAllMocks);

  it.each([
    [[]], // No metric defined
    [[{ metricName: null, entityId: { pluginId: 'stans-stash' } }]], // Metric does not define a name
    [[{ metricName: 'Snacks Available', entityId: { pluginId: null } }]] // Metric does not define a pluginId
  ])('does not render anything for incomplete metrics', metrics => {
    // Given
    const event = fromJS({
      metadata: {
        metrics
      }
    });

    // When
    const wrapper = shallow(<SubEntityInformation event={event} />);

    // Then
    expect(wrapper.getElement()).not.toBeTruthy();
  });

  it('does not render anything if metric definition does not provide a metricPattern', () => {
    // Given
    const event = fromJS({
      metadata: {
        metrics: [
          {
            metricName: 'Snacks Available',
            entityId: { pluginId: 'stans-stash' }
          }
        ]
      }
    });
    getMetricDefinition.mockReturnValueOnce({});

    // When
    const wrapper = shallow(<SubEntityInformation event={event} />);

    // Then
    expect(wrapper.getElement()).not.toBeTruthy();
  });

  it('does not render anything if metric definition provides a RegExp metricPattern', () => {
    // Given
    const event = fromJS({
      metadata: {
        metrics: [
          {
            metricName: 'Snacks Available',
            entityId: { pluginId: 'stans-stash' }
          }
        ]
      }
    });
    getMetricDefinition.mockReturnValueOnce({ metricPattern: new RegExp(/.*/) });

    // When
    const wrapper = shallow(<SubEntityInformation event={event} />);

    // Then
    expect(wrapper.getElement()).not.toBeTruthy();
  });

  it('renders placeholderLabel and  matched metric name if metric definition provides a label and pattern', () => {
    // Given
    const event = fromJS({
      metadata: {
        metrics: [
          {
            metricName: 'Snacks Available',
            entityId: { pluginId: 'stans-stash' }
          }
        ]
      }
    });
    getMetricDefinition.mockReturnValueOnce({
      metricPattern: {
        placeholderLabel: 'myMetricLabel',
        pattern: /(.*)/
      }
    });

    // When
    const wrapper = shallow(<SubEntityInformation event={event} />);

    // Then
    expect(wrapper.text()).toContain('myMetricLabel');
    expect(wrapper.text()).toContain('Snacks Available');
  });

  it('renders placeholderLabels and matched metric names if metric definition provides multiple labels and patterns', () => {
    // Given
    const event = fromJS({
      metadata: {
        metrics: [
          {
            metricName: 'prefix.foo.postfix',
            entityId: { pluginId: 'stans-stash' }
          },
          {
            metricName: 'pre.bar',
            entityId: { pluginId: 'stans-stash' }
          }
        ]
      }
    });
    getMetricDefinition.mockReturnValueOnce({
      metricPattern: {
        placeholderLabel: 'Sub-entity',
        pattern: /prefix.(.*).postfix/
      }
    });
    getMetricDefinition.mockReturnValueOnce({
      metricPattern: {
        placeholderLabel: 'Sub-entity',
        pattern: /pre.(.*)/
      }
    });

    // When
    const wrapper = shallow(<SubEntityInformation event={event} />);

    // Then
    expect(wrapper.text()).toContain('Sub-entity:');
    expect(wrapper.text()).toContain('foo');
    expect(wrapper.text()).toContain('bar');
  });
});
