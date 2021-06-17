/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { t } from 'in-i18n';

const maxClusterNameRegex = new RegExp(/^[\w-_]{1,64}$/);

function validateClusterName(clusterName) {
  return maxClusterNameRegex.test(clusterName);
}

export function clusterNameValidator(str) {
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
