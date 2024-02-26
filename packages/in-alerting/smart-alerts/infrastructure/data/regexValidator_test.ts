/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { GenericInfraAlertRule } from '@instana/types';

import regexValidator, { regexValidationError } from 'in-alerting/smart-alerts/infrastructure/data/regexValidator';
import createRuleForm from 'in-alerting/smart-alerts/infrastructure/form/ruleForm';
import { t } from 'in-i18n';

describe('in-alerting/smart-alerts/infrastructure/data/regexValidator.tsx', () => {
  it('test if returns valid regex', () => {
    // GIVEN
    const datasetForm = {
      entityType: 'netCoreRuntimePlatform',
      metricName: 'foo.[a-z]',
      aggregation: 'MEAN',
      crossSeriesAggregation: 'MEAN',
      regex: true
    };
    const ruleData = { rule: createRuleForm(datasetForm as GenericInfraAlertRule) };

    // WHEN
    const result = regexValidator(ruleData);

    // THEN
    expect(result).toEqual(null);
  });

  it('test if returns an error message when the regex is invalid and the entity type is not selected', () => {
    // GIVEN
    const datasetForm = {
      entityType: 'netCoreRuntimePlatform',
      metricName: 'foo.[a-z]********',
      aggregation: 'MEAN',
      crossSeriesAggregation: 'MEAN',
      regex: true
    };
    const ruleData = { rule: createRuleForm(datasetForm as GenericInfraAlertRule) };

    // WHEN
    const result = regexValidator(ruleData);

    // THEN
    expect(result).toEqual([
      {
        severity: 'error',
        message: t('in-alerting:smartAlerts.infrastructure.regexNotValid'),
        category: regexValidationError
      }
    ]);
  });

  it('test if returns an error message when the metricName and entityType is empty', () => {
    // GIVEN
    const datasetForm = {
      metricName: 'foo.[a-z]',
      regex: true
    };
    const ruleData = { rule: createRuleForm(datasetForm as GenericInfraAlertRule) };

    // WHEN
    const result = regexValidator(ruleData);

    // THEN
    expect(result).toEqual([
      {
        severity: 'error',
        message: t('in-alerting:smartAlerts.infrastructure.selectEntityType'),
        category: regexValidationError
      }
    ]);
  });

  it('test if datasetForm is empty', () => {
    // GIVEN
    const result = regexValidator(undefined);

    // THEN
    expect(result).toEqual(undefined);

    // GIVEN
    const emptyResult = regexValidator({});

    // THEN
    expect(emptyResult).toEqual(null);
  });
});
