/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Action } from 'in-types';
import { t } from 'in-i18n';

export const getType = (action: Action) => {
  if (action.type === 'doc_link') {
    return t('in-settings:tabs:docLink');
  } else {
    return action.type;
  }
};
