/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';
import { shallow } from 'enzyme';
import React from 'react';

import { getMetricOptions as gMO, MetricEntityType } from 'in-custom-dashboards/widgets/SloLegacy/sli/metricFormData';
import { MetricsForm } from 'in-custom-dashboards/widgets/SloLegacy/sli/MetricsForm';
import { MonitoringSource } from 'in-custom-dashboards/widgets/SloLegacy/constants';
import PercentageInput from 'in-service-levels/components/PercentageInput';
import { notBlankValidator } from 'in-services/validators/string';
import { noop } from 'in-services/util/function';
import Input from 'in-components/form/Input';

const getMetricOptions = gMO as jest.MockedFunction<typeof gMO>;

jest.mock('in-custom-dashboards/widgets/SloLegacy/sli/metricFormData', () => {
  const _metricFormData = jest.requireActual('in-custom-dashboards/widgets/SloLegacy/sli/metricFormData');
  return {
    ..._metricFormData,
    getMetricOptions: jest.fn((...args) => _metricFormData.getMetricOptions(...args))
  };
});

describe('in-custom-dashboards/widgets/SloLegacy/sli/MetricsForm', () => {
  const baseForm = createMapForm({
    items: {
      metricAggregation: createField({ value: '' }),
      metricName: createField({ value: '' }),
      threshold: createField({ value: 0 })
    }
  });

  it('displays an error state if metricName is invalid and had been touched', () => {
    // Given
    const form = baseForm
      .put('metricName', createField({ value: '', validator: notBlankValidator }))
      .updateIn(['metricName'], f => f.setTouched(true));

    // When
    const wrapper = shallow(
      <MetricsForm form={form} entityType="application" metricEntityType="calls" onChange={noop} />
    );

    // Then
    expect(wrapper.findWhere(n => n.prop('id') === 'new-sli-metric').prop('hasError')).toBeTruthy();
  });

  it('updates the forms metricName field on changes to the metric name select', () => {
    // Given
    const updatedFormCaptor = jest.fn();
    const onChange = (f: MapForm<any>) => updatedFormCaptor(f.toJS());

    // When
    const wrapper = shallow(
      <MetricsForm form={baseForm} entityType="application" metricEntityType="calls" onChange={onChange} />
    );
    wrapper.findWhere(n => n.prop('id') === 'new-sli-metric').simulate('change', { target: { value: 'latency' } });

    // Then
    expect(updatedFormCaptor).toHaveBeenLastCalledWith(
      expect.objectContaining({
        metricName: 'latency'
      })
    );
  });

  it('displays all metric options for the given entityType and metricEntityType', () => {
    // Given
    const entityType = 'pizza' as MonitoringSource;
    const metricEntityType = 'cheese' as MetricEntityType<MonitoringSource>;
    const metricOptions = {
      temperature: {
        name: 'temperature',
        label: 'Temperature'
      },
      solidity: {
        name: 'solidity',
        label: 'Solidity'
      }
    };
    getMetricOptions.mockReturnValueOnce(metricOptions as unknown as ReturnType<typeof getMetricOptions>);

    // When
    const wrapper = shallow(
      <MetricsForm entityType={entityType} metricEntityType={metricEntityType} form={baseForm} onChange={noop} />
    );

    // Then
    expect(
      wrapper.containsMatchingElement(
        <option value="temperature" key="temperature">
          Temperature
        </option>
      )
    ).toBeTruthy();
    expect(
      wrapper.containsMatchingElement(
        <option value="solidity" key="solidity">
          Solidity
        </option>
      )
    ).toBeTruthy();
  });

  it('displays an error state if metricAggregation is invalid and had been touched', () => {
    // Given
    const form = baseForm
      .put('metricAggregation', createField({ value: '', validator: notBlankValidator }))
      .updateIn(['metricAggregation'], f => f.setTouched(true));

    // When
    const wrapper = shallow(
      <MetricsForm form={form} entityType="application" metricEntityType="calls" onChange={noop} />
    );

    // Then
    expect(wrapper.findWhere(n => n.prop('id') === 'new-sli-aggregation').prop('hasError')).toBeTruthy();
  });

  it('updates the forms metricAggregation field on changes to the metric aggregation select', () => {
    // Given
    const updatedFormCaptor = jest.fn();
    const onChange = (f: MapForm<any>) => updatedFormCaptor(f.toJS());

    // When
    const wrapper = shallow(
      <MetricsForm form={baseForm} entityType="application" metricEntityType="calls" onChange={onChange} />
    );
    wrapper.findWhere(n => n.prop('id') === 'new-sli-aggregation').simulate('change', { target: { value: 'P99' } });

    // Then
    expect(updatedFormCaptor).toHaveBeenLastCalledWith(
      expect.objectContaining({
        metricAggregation: 'P99'
      })
    );
  });

  it('displays all aggregation options for the currently selected metricName', () => {
    // Given
    const form = baseForm.updateIn(['metricName'], f => (f as Field<string>).setValue('temperature'));
    const entityType = 'pizza' as MonitoringSource;
    const metricEntityType = 'cheese' as MetricEntityType<MonitoringSource>;
    const metricOptions = {
      temperature: {
        name: 'temperature',
        defaultValue: 'MEAN',
        options: [
          { value: 'MEAN', label: 'mean' },
          { value: 'MAX', label: 'max' }
        ]
      }
    };
    getMetricOptions.mockReturnValueOnce(metricOptions as unknown as ReturnType<typeof getMetricOptions>);

    // When
    const wrapper = shallow(
      <MetricsForm entityType={entityType} metricEntityType={metricEntityType} form={form} onChange={noop} />
    );

    // Then
    expect(
      wrapper.containsMatchingElement(
        <option value="MEAN" key="MEAN">
          mean
        </option>
      )
    ).toBeTruthy();
    expect(
      wrapper.containsMatchingElement(
        <option value="MAX" key="MAX">
          max
        </option>
      )
    ).toBeTruthy();
  });

  describe('for percent based metrics', () => {
    it('displays a percentage input', () => {
      // Given
      const form = baseForm.updateIn(['metricName'], f => (f as Field<string>).setValue('solidity'));
      const entityType = 'pizza' as MonitoringSource;
      const metricEntityType = 'cheese' as MetricEntityType<MonitoringSource>;
      const metricOptions = {
        solidity: {
          name: 'solidity',
          type: 'rate',
          options: []
        }
      };
      getMetricOptions.mockReturnValueOnce(metricOptions as unknown as ReturnType<typeof getMetricOptions>);

      // When
      const wrapper = shallow(
        <MetricsForm entityType={entityType} metricEntityType={metricEntityType} form={form} onChange={noop} />
      );

      // Then
      expect(wrapper.exists(PercentageInput)).toBeTruthy();
    });

    it('displays an error state if the threshold is invalid and has been touched', () => {
      // Given
      const entityType = 'pizza' as MonitoringSource;
      const metricEntityType = 'cheese' as MetricEntityType<MonitoringSource>;
      const metricOptions = {
        solidity: {
          name: 'solidity',
          type: 'rate',
          options: []
        }
      };
      getMetricOptions.mockReturnValueOnce(metricOptions as unknown as ReturnType<typeof getMetricOptions>);
      const form = baseForm
        .updateIn(['metricName'], f => (f as Field<string>).setValue('solidity'))
        .put('threshold', createField({ value: '', validator: notBlankValidator }))
        .updateIn(['threshold'], f => f.setTouched(true));

      // When
      const wrapper = shallow(
        <MetricsForm entityType={entityType} metricEntityType={metricEntityType} form={form} onChange={noop} />
      );

      // Then
      expect(wrapper.findWhere(n => n.prop('id') === 'new-sli-metric-threshold').prop('hasError')).toBeTruthy();
    });

    it('updates the forms threshold field on changes to the threshold input', () => {
      // Given
      const updatedFormCaptor = jest.fn();
      const onChange = (f: MapForm<any>) => updatedFormCaptor(f.toJS());
      // Given
      const entityType = 'pizza' as MonitoringSource;
      const metricEntityType = 'cheese' as MetricEntityType<MonitoringSource>;
      const metricOptions = {
        solidity: {
          name: 'solidity',
          type: 'rate',
          options: []
        }
      };
      getMetricOptions.mockReturnValueOnce(metricOptions as unknown as ReturnType<typeof getMetricOptions>);
      const form = baseForm.updateIn(['metricName'], f => (f as Field<string>).setValue('solidity'));

      // When
      const wrapper = shallow(
        <MetricsForm form={form} entityType={entityType} metricEntityType={metricEntityType} onChange={onChange} />
      );
      wrapper.findWhere(n => n.prop('id') === 'new-sli-metric-threshold').simulate('change', 98);

      // Then
      expect(updatedFormCaptor).toHaveBeenLastCalledWith(
        expect.objectContaining({
          threshold: 98
        })
      );
    });
  });

  describe('for time based metrics', () => {
    it('displays a number input', () => {
      // Given
      const form = baseForm.updateIn(['metricName'], f => (f as Field<string>).setValue('temperature'));
      const entityType = 'pizza' as MonitoringSource;
      const metricEntityType = 'cheese' as MetricEntityType<MonitoringSource>;
      const metricOptions = {
        temperature: {
          name: 'temperature',
          type: 'count',
          options: []
        }
      };
      getMetricOptions.mockReturnValueOnce(metricOptions as unknown as ReturnType<typeof getMetricOptions>);

      // When
      const wrapper = shallow(
        <MetricsForm entityType={entityType} metricEntityType={metricEntityType} form={form} onChange={noop} />
      );

      // Then
      expect(wrapper.containsMatchingElement(<Input id="new-sli-metric-threshold" type="number" />)).toBeTruthy();
    });

    it('displays an error state if the threshold is invalid and has been touched', () => {
      // Given
      const entityType = 'pizza' as MonitoringSource;
      const metricEntityType = 'cheese' as MetricEntityType<MonitoringSource>;
      const metricOptions = {
        temperature: {
          name: 'temperature',
          type: 'count',
          options: []
        }
      };
      getMetricOptions.mockReturnValueOnce(metricOptions as unknown as ReturnType<typeof getMetricOptions>);
      const form = baseForm
        .updateIn(['metricName'], f => (f as Field<string>).setValue('temperature'))
        .put('threshold', createField({ value: '', validator: notBlankValidator }))
        .updateIn(['threshold'], f => f.setTouched(true));

      // When
      const wrapper = shallow(
        <MetricsForm entityType={entityType} metricEntityType={metricEntityType} form={form} onChange={noop} />
      );

      // Then
      expect(wrapper.findWhere(n => n.prop('id') === 'new-sli-metric-threshold').prop('hasError')).toBeTruthy();
    });

    it('updates the forms threshold field on changes to the threshold input', () => {
      // Given
      const updatedFormCaptor = jest.fn();
      const onChange = (f: MapForm<any>) => updatedFormCaptor(f.toJS());
      // Given
      const entityType = 'pizza' as MonitoringSource;
      const metricEntityType = 'cheese' as MetricEntityType<MonitoringSource>;
      const metricOptions = {
        temperature: {
          name: 'temperature',
          type: 'count',
          options: []
        }
      };
      getMetricOptions.mockReturnValueOnce(metricOptions as unknown as ReturnType<typeof getMetricOptions>);
      const form = baseForm.updateIn(['metricName'], f => (f as Field<string>).setValue('temperature'));

      // When
      const wrapper = shallow(
        <MetricsForm form={form} entityType={entityType} metricEntityType={metricEntityType} onChange={onChange} />
      );
      wrapper
        .findWhere(n => n.prop('id') === 'new-sli-metric-threshold')
        .simulate('change', { target: { value: 98, valueAsNumber: 98 } });

      // Then
      expect(updatedFormCaptor).toHaveBeenLastCalledWith(
        expect.objectContaining({
          threshold: 98
        })
      );
    });
  });
});
