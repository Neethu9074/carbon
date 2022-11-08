/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Nullish } from 'in-types';
import { Action } from 'in-types';
import { t } from 'in-i18n';

export const getType = (action: Action | Nullish) => {
  if (isDocLink(action?.type)) {
    return t('in-settings:tabs.docLink');
  } else if (isScript(action?.type)) {
    return t('in-settings:tabs.script');
  } else {
    return action?.type;
  }
};

export const isDocLink = (type?: string) => type === DOC_LINK_TYPE;
export const isScript = (type?: string) => type === SCRIPT_TYPE;

export const DOC_LINK_TYPE = 'doc_link';
export const SCRIPT_TYPE = 'SCRIPT';
