/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t } from 'in-i18n';

import locals from './BackendTraceButton.mless';

const ViewCrashGroupButton = ({ href }) => {
  return (
    <a href={href} className={locals.button}>
      {/* {label} */}
      {t('in-mobile-apps:sessionView.tabsSumCrashGroupButton.viewCrashGrpBtn')}
    </a>
  );
};

export default ViewCrashGroupButton;
