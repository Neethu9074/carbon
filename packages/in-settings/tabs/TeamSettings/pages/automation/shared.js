/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { t } from 'in-i18n';

export const getType = action => {
  if (action.type === 'doc_link') {
    return t('in-settings:tabs:docLink');
  } else {
    return action.type;
  }
};
