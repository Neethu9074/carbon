/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Trans } from '@instana/i18n-react';
import { Link } from '@instana/legacy';

import locals from './PopupMessage.mless';

export default function PoPMessage() {
  const popDocsUrl = 'https://www.ibm.com/docs/SSE1JP5_current/src/pages/synthetic_monitoring/synmon_permissions.html';
  const docLinkComponent = (
    <Trans
      i18nKey="in-synthetics:dashboard.testList.popDialog.popUpDialog"
      components={{
        documentationLink: (
          <Link href={popDocsUrl} external>
            &nbsp;
          </Link>
        )
      }}
    />
  );

  return (
    <div className={locals.container}>
      <h1 className={locals.controls}>{docLinkComponent}</h1>
      {/* <div className={locals.controls}>{docLinkComponent}</div> */}
    </div>
  );
}
