/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, createField } from 'formalistic';

import { BrowserScriptConfiguration, HttpScriptConfiguration, SyntheticTest } from '@instana/types';

import hasEmptyStrings from 'in-synthetics/utils/hasEmptyStrings';
import { isBlank, isNotBlank } from 'in-services/util/string';

const cleanConfigurationForm = (form: MapForm<any>, test: SyntheticTest): SyntheticTest => {
  const testId: string = test.id || '';
  const isActive: boolean = test.active;
  const modifiedAt: number = test.modifiedAt || 0;
  const { retries, timeout, retryInterval, markSyntheticCall } = test.configuration;
  const isBrowserScript = form.get('configuration').get('syntheticType').value === 'BrowserScript';
  const isHTTPScript = form.get('configuration').get('syntheticType').value === 'HTTPScript';
  const isWebpage = ['WebpageAction', 'WebpageScript'].includes(form.get('configuration').get('syntheticType').value);

  let testConfig: SyntheticTest;
  let updatedForm: MapForm<any>;

  // Add common properties
  updatedForm =
    isHTTPScript || isBrowserScript
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

  // Add browser property if present in browser script test
  // @ts-expect-error browser property could be present
  if (isNotBlank(test.configuration?.browser) && (isBrowserScript || isWebpage)) {
    updatedForm = form.put('active', createField({ value: isActive })).put(
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
        //@ts-expect-error browser property could be present
        .put('browser', createField({ value: test.configuration?.browser }))
    );
  }

  // Remove applicationId property if not present
  if (isBlank(updatedForm.get('applicationId').value)) {
    updatedForm = updatedForm.remove('applicationId');
  }

  // Add default customProperties
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
