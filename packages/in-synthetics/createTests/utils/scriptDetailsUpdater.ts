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
    const content = JSON.parse(script);
    if (!content || typeof content !== 'object') {
      return false;
    }
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
  const isSide = isSideScript((configForm.get('script') as Field<string>)?.value);
  if (isUpdateConfig && !isUpdated) {
    if (configForm.get('script')) {
      return {
        name: t('in-synthetics:dialog.updateTest.scriptSavedMessage'),
        text: (configForm.get('script') as Field<string>).value,
        extension: isSide ? 'side' : 'js'
      };
    } else {
      return {
        name: t('in-synthetics:dialog.updateTest.bundleSavedMessage'),
        text: (configForm.getIn(['scripts', 'bundle']) as Field<string>).value,
        scriptFile: (configForm.getIn(['scripts', 'scriptFile']) as Field<string>).value,
        extension: 'zip'
      };
    }
  } else if (scriptDetails?.modified && configForm.get('script')) {
    return {
      name: scriptDetails?.name,
      text: (configForm.get('script') as Field<string>).value,
      extension: isNotBlank(scriptDetails?.name) ? (isSide ? 'side' : 'js') : ''
    };
  } else {
    return { name: '', text: '', extension: 'js' };
  }
}
