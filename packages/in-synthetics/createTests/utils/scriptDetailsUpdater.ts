/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';

import { Code } from 'in-synthetics/utils/constants';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export const isSideScript = (script: string) => {
  try {
    JSON.parse(script);
  } catch (e) {
    return false;
  }
  return true;
};

export function scriptDetailsUpdater(
  configForm: MapForm<any>,
  isUpdateConfig: boolean,
  isUpdated: boolean,
  scriptDetails?: Code
) {
  return isUpdateConfig && !isUpdated
    ? configForm.get('script')
      ? {
          name: t('in-synthetics:dialog.updateTest.scriptSavedMessage'),
          text: (configForm.get('script') as Field<string>).value,
          extension: isSideScript((configForm.get('script') as Field<string>).value) ? 'side' : 'js'
        }
      : {
          name: t('in-synthetics:dialog.updateTest.bundleSavedMessage'),
          text: (configForm.getIn(['scripts', 'bundle']) as Field<string>).value,
          scriptFile: (configForm.getIn(['scripts', 'scriptFile']) as Field<string>).value,
          extension: 'zip'
        }
    : scriptDetails?.modified && configForm.get('script')
    ? {
        name: scriptDetails?.name,
        text: (configForm.get('script') as Field<string>).value,
        extension: isNotBlank(scriptDetails?.name)
          ? isSideScript((configForm.get('script') as Field<string>).value)
            ? 'side'
            : 'js'
          : ''
      }
    : { name: '', text: '', extension: 'js' };
}
