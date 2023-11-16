/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, createField } from 'formalistic';

import { BrowserScriptConfiguration, HttpScriptConfiguration, SyntheticTest } from '@instana/types';

import hasEmptyStrings from 'in-synthetics/utils/hasEmptyStrings';

const cleanConfigurationForm = (form: MapForm<any>, test: SyntheticTest): SyntheticTest => {
  const testId: string = test.id || '';
  const isActive: boolean = test.active;
  const modifiedAt: number = test.modifiedAt || 0;
  const { retries, timeout, retryInterval, markSyntheticCall } = test.configuration;

  let testConfig: SyntheticTest;
  let updatedForm: MapForm<any>;
  updatedForm = ['HTTPScript', 'BrowserScript'].includes(form.get('configuration').get('syntheticType').value)
    ? form
        .put('active', createField({ value: isActive }))
        .put('modifiedAt', createField({ value: modifiedAt }))
        .put(
          'configuration',
          form
            .get('configuration')
            .put('retries', createField({ value: retries }))
            .put('timeout', createField({ value: timeout }))
            .put('retryInterval', createField({ value: retryInterval }))
            .put('markSyntheticCall', createField({ value: markSyntheticCall }))
            .put(
              'scriptType',
              createField({
                value: (test.configuration as BrowserScriptConfiguration | HttpScriptConfiguration).scriptType
              })
            )
        )
    : form
        .put('active', createField({ value: isActive }))
        .put('modifiedAt', createField({ value: modifiedAt }))
        .put(
          'configuration',
          form
            .get('configuration')
            .put('retries', createField({ value: retries }))
            .put('timeout', createField({ value: timeout }))
            .put('retryInterval', createField({ value: retryInterval }))
            .put('markSyntheticCall', createField({ value: markSyntheticCall }))
        );

  if (test.applicationLabel === '' || test.applicationLabel === undefined) {
    updatedForm = updatedForm.remove('applicationId');
  }

  if (hasEmptyStrings(updatedForm.get('customProperties').value)) {
    updatedForm = updatedForm.put('customProperties', createField({ value: {} }));
  }

  if (
    updatedForm.get('configuration').get('syntheticType').value === 'HTTPAction' &&
    hasEmptyStrings(updatedForm.get('configuration').get('headers').value)
  ) {
    updatedForm = updatedForm.put('configuration', updatedForm.get('configuration').remove('headers'));
    testConfig = {
      id: testId,
      ...updatedForm.toJS()
    } as SyntheticTest;
  } else {
    testConfig = {
      id: testId,
      ...updatedForm.toJS()
    } as SyntheticTest;
  }

  return testConfig;
};

export default cleanConfigurationForm;
