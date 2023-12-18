/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ValidationResult } from 'formalistic';

import { t } from 'in-i18n';

const maxClusterNameRegex = new RegExp(/^[\w-_]{1,64}$/);

function validateClusterName(clusterName: string) {
  return maxClusterNameRegex.test(clusterName);
}

export function clusterNameValidator(str: string): ValidationResult {
  if (!validateClusterName(str)) {
    return [
      {
        severity: 'error',
        message: t(
          'in-waiting-for-deployment:content.theClusterNameMustBeACombinationOfLettersDashesAndUnderscoresUpTo64CharactersLong'
        )
      }
    ];
  }
  return null;
}
