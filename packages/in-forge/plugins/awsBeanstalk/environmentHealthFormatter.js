/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export const environmentHealthFormatter = state => {
  state = Math.round(state);
  if (state < 1) {
    return t('in-forge:plugins.awsBeanstalk.labelOK');
  } else if (state < 2) {
    return t('in-forge:plugins.awsBeanstalk.labelInfo');
  } else if (state < 6) {
    return t('in-forge:plugins.awsBeanstalk.labelUnknown');
  } else if (state < 11) {
    return t('in-forge:plugins.awsBeanstalk.labelNoData');
  } else if (state < 16) {
    return t('in-forge:plugins.awsBeanstalk.labelWarning');
  } else if (state < 21) {
    return t('in-forge:plugins.awsBeanstalk.labelDegraded');
  } else if (state < 26) {
    return t('in-forge:plugins.awsBeanstalk.labelSevere');
  }
};
