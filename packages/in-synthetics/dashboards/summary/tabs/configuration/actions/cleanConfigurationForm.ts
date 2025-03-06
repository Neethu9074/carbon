/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm, createField } from 'formalistic';
import { isEmpty } from 'lodash';

import { BrowserScriptConfiguration, HttpScriptConfiguration, SyntheticTest } from '@instana/types';

import { Invalid, TargetFilter } from 'in-synthetics/utils/constants';
import hasEmptyStrings from 'in-synthetics/utils/hasEmptyStrings';
import { isBlank, isNotBlank } from 'in-services/util/string';

const cleanConfigurationForm = (form: MapForm<any>, test: SyntheticTest): SyntheticTest => {
  const testId: string = test.id || '';
  const isActive: boolean = test.active;
  const modifiedAt: number = test.modifiedAt || 0;
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
            form.get('configuration').put(
              'scriptType',
              createField({
                value: (test.configuration as BrowserScriptConfiguration | HttpScriptConfiguration).scriptType
              })
            )
          )
      : form.put('active', createField({ value: isActive })).put('modifiedAt', createField({ value: modifiedAt }));

  // @ts-expect-error browser property could be present
  if ((isBrowserScript || isWebpage) && isNotBlank(test.configuration?.browser)) {
    // Add browser property if present in browser script test
    updatedForm = updatedForm.put(
      'configuration',
      updatedForm
        .get('configuration')
        //@ts-expect-error browser property could be present
        .put('browser', createField({ value: test.configuration?.browser }))
    );
  }

  // Remove applicationId property if not present
  if (isBlank(updatedForm.get('applicationId')?.value)) {
    updatedForm = updatedForm.remove('applicationId');
  }

  // Remove applications property if not present
  if (
    (updatedForm.get('applications')?.value.length === 1 && hasEmptyStrings(updatedForm.get('applications')?.value)) ||
    updatedForm.get('applications')?.value.length === 0
  ) {
    updatedForm = updatedForm.remove('applications');
  }

  if (
    (updatedForm.get('websites')?.value.length === 1 && hasEmptyStrings(updatedForm.get('websites')?.value)) ||
    updatedForm.get('websites')?.value.length === 0
  ) {
    updatedForm = updatedForm.remove('websites');
  }

  if (
    (updatedForm.get('mobileApps')?.value.length === 1 && hasEmptyStrings(updatedForm.get('mobileApps')?.value)) ||
    updatedForm.get('mobileApps')?.value.length === 0
  ) {
    updatedForm = updatedForm.remove('mobileApps');
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
  } else if (updatedForm.get('configuration').get('syntheticType').value === 'DNS') {
    if (isEmpty(updatedForm.get('configuration').get('targetValues').value)) {
      updatedForm = updatedForm.put('configuration', updatedForm.get('configuration').remove('targetValues'));
    } else {
      const updatedFilter = updatedForm
        .get('configuration')
        .get('targetValues')
        .value.map(({ id, error, ...otherValues }: { id: string; error: Invalid }) => otherValues)
        .filter((targetValue: TargetFilter) => isNotBlank(targetValue.key));
      updatedForm = updatedForm.updateIn(['configuration', 'targetValues'], (field: Item) =>
        (field as Field<TargetFilter>).setValue(updatedFilter).setTouched(true)
      );
    }
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
