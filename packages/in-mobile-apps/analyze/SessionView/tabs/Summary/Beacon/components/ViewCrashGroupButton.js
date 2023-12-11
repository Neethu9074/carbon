/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { t } from 'in-i18n';

import locals from './BackendTraceButton.mless';

const ViewCrashGroupButton = () => {
  return (
    // <a href={href} className={locals.button}>
    //   {/* {label} */}
    //   {t('in-mobile-apps:sessionView.tabsSumCrashGroupButton.viewCrashGrpBtn')}
    // </a>

    <Button
      className={locals.button}
      kind="primaryv2"
      href={'dummyvalue'}
      onClick={e => {
        e.stopPropagation();
      }}
      size="compact"
    >
      {t('in-mobile-apps:sessionView.tabsSumCrashGroupButton.viewCrashGrpBtn')}
    </Button>
  );
};

export default ViewCrashGroupButton;
