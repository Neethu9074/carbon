/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Nullish } from 'in-types';
import { Action } from 'in-types';
import { t } from 'in-i18n';

export const getType = (action: Action | Nullish) => {
  if (action?.type === 'doc_link') {
    return t('in-settings:tabs.docLink');
  } else if (action?.type === 'SCRIPT') {
    return t('in-settings:tabs.script');
  } else if (action?.type === 'HTTP') {
    return t('in-settings:tabs.http');
  } else {
    return action?.type;
  }
};
