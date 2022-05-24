/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export const getType = action => {
  if (action.type === 'doc_link') {
    return t('in-settings:tabs:docLink');
  } else {
    return action.type;
  }
};
