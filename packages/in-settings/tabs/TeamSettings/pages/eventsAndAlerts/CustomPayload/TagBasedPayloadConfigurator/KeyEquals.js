/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import locals from './KeyEquals.mless';

export default function KeyEquals() {
  return <div className={locals.keyEqualsOperator}>{t('in-settings:tabs.keyEquals')}</div>;
}
