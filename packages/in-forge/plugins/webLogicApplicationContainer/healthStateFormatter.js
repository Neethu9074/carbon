/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export const healthStateFormatter = state => {
  state = Math.round(state);
  if (state < 0) {
    return t('in-forge:plugins.webLogicAppContainer.labelUnknown');
  } else if (state < 1) {
    return t('in-forge:plugins.webLogicAppContainer.labelOK');
  } else if (state < 2) {
    return t('in-forge:plugins.webLogicAppContainer.labelWarning');
  } else if (state < 3) {
    return t('in-forge:plugins.webLogicAppContainer.labelCritical');
  } else if (state < 4) {
    return t('in-forge:plugins.webLogicAppContainer.labelFailed');
  } else if (state < 5) {
    return t('in-forge:plugins.webLogicAppContainer.labelOverloaded');
  }
};
