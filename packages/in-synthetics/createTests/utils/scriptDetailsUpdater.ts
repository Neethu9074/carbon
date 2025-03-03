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

const getExtension = (configForm: MapForm<any>) => {
  return isSideScript((configForm.get('script') as Field<string>)?.value) ? 'side' : 'js';
};

export function scriptDetailsUpdater(
  configForm: MapForm<any>,
  isUpdateConfig: boolean,
  isUpdated: boolean,
  scriptDetails?: Code
) {
  if (isUpdateConfig && !isUpdated) {
    if (configForm.get('script')) {
      return {
        name: t('in-synthetics:dialog.updateTest.scriptSavedMessage'),
        text: (configForm.get('script') as Field<string>).value,
        extension: getExtension(configForm)
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
      extension: isNotBlank(scriptDetails?.name) ? getExtension(configForm) : ''
    };
  } else {
    return { name: '', text: '', extension: 'js' };
  }
}

export function base64ToFileFormat(base64String: string) {
  const byteArray = Uint8Array.from((globalThis as any).atob(base64String), (c: string) => c.charCodeAt(0));
  return new File([byteArray], 'bundled-scripts.zip', { type: 'application/zip' });
}
