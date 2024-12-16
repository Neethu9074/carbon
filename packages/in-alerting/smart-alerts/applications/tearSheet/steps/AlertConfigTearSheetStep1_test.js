/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import { rule } from 'postcss';
import React from 'react';

import AlertConfigTearSheetStep1 from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep1';
import { blueprintConfigs, getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { alertConfig } from 'in-alerting/smart-alerts/applications/data/alertConfigData.json';
import Menu from 'in-alerting/smart-alerts/components/Menu';
import { t } from 'in-i18n';

describe('in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep1', () => {
  const props = {
    form: createSmartAlertForm(alertConfig, true, true),
    updateForm: jest.fn(),
    blueprintConfigList: blueprintConfigs.filter(config => config?.type !== 'logs')
  };
  it('renders BPs correctly', () => {
    render(<AlertConfigTearSheetStep1 {...props} />);
    expect(screen.getByText(t('in-alerting:smartAlerts.applications.tearSheet.alertHeadline'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.applications.blueprintConfig.slowness.name'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.applications.blueprintConfig.errors.name'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.applications.blueprintConfig.statusCode.name'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.applications.blueprintConfig.throughput.name'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.applications.blueprintConfig.errors.tearSheetHeadline'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.applications.blueprintConfig.errors.tearSheetDescription'))
    ).toBeInTheDocument();
  });

  describe('test slowness BP', () => {
    it('change Bp to slowness', () => {
      const blueprintConfig = getBlueprintConfig('slowness');
      const wrapper = shallow(<AlertConfigTearSheetStep1 {...props} />);

      wrapper.find(Menu).props().onItemClick(blueprintConfig);
      expect(props.updateForm).toHaveBeenCalled();
    });

    it('test the headline and Description when slowness BP is selected ', () => {
      const slownessAlertConfig = {
        ...alertConfig,
        rules: [{ rule: { aggregation: 'P90', alertType: 'slowness', metricName: 'latency' } }]
      };
      const props = {
        form: createSmartAlertForm(slownessAlertConfig, true, true),
        updateForm: jest.fn(),
        blueprintConfigList: blueprintConfigs.filter(config => config?.type !== 'logs')
      };

      render(<AlertConfigTearSheetStep1 {...props} />);
      expect(
        screen.getByText(t('in-alerting:smartAlerts.applications.blueprintConfig.slowness.tearSheetHeadline'))
      ).toBeInTheDocument();
      expect(
        screen.getByText(t('in-alerting:smartAlerts.applications.blueprintConfig.slowness.tearSheetDescription'))
      ).toBeInTheDocument();
    });
  });

  describe('test statusCode BP', () => {
    it('change Bp to statusCode', () => {
      const blueprintConfig = getBlueprintConfig('statusCode');
      const wrapper = shallow(<AlertConfigTearSheetStep1 {...props} />);

      wrapper.find(Menu).props().onItemClick(blueprintConfig);
      expect(props.updateForm).toHaveBeenCalled();
    });

    it('test the headline and Description when statusCode BP is selected ', () => {
      const statusCodeAlertConfig = {
        ...alertConfig,
        rules: [{ rule: { ...rule, alertType: 'statusCode' } }]
      };
      const props = {
        form: createSmartAlertForm(statusCodeAlertConfig, true, true),
        updateForm: jest.fn(),
        blueprintConfigList: blueprintConfigs.filter(config => config?.type !== 'logs')
      };

      render(<AlertConfigTearSheetStep1 {...props} />);
      expect(
        screen.getByText(t('in-alerting:smartAlerts.applications.blueprintConfig.statusCode.tearSheetHeadline'))
      ).toBeInTheDocument();
      expect(
        screen.getByText(t('in-alerting:smartAlerts.applications.blueprintConfig.statusCode.tearSheetDescription'))
      ).toBeInTheDocument();
    });
  });

  describe('test throughput BP', () => {
    it('change Bp to throughput', () => {
      const blueprintConfig = getBlueprintConfig('throughput');
      const wrapper = shallow(<AlertConfigTearSheetStep1 {...props} />);

      wrapper.find(Menu).props().onItemClick(blueprintConfig);
      expect(props.updateForm).toHaveBeenCalled();
    });

    it('test the headline and Description when throughput BP is selected ', () => {
      const throughputAlertConfig = {
        ...alertConfig,
        rules: [{ rule: { ...rule, alertType: 'throughput' } }]
      };
      const props = {
        form: createSmartAlertForm(throughputAlertConfig, true, true),
        updateForm: jest.fn(),
        blueprintConfigList: blueprintConfigs.filter(config => config?.type !== 'logs')
      };

      render(<AlertConfigTearSheetStep1 {...props} />);
      expect(
        screen.getByText(t('in-alerting:smartAlerts.applications.blueprintConfig.throughput.tearSheetHeadline'))
      ).toBeInTheDocument();
      expect(
        screen.getByText(t('in-alerting:smartAlerts.applications.blueprintConfig.throughput.tearSheetDescription'))
      ).toBeInTheDocument();
    });
  });
});
