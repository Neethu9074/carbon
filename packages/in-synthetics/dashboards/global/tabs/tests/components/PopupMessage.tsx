/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Trans } from '@instana/i18n-react';
import { Link } from '@instana/components';

import locals from './PopupMessage.mless';

export default function PoPMessage() {
  const popDocsUrl = 'https://ibm.biz/synmon_permissions';
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

  return <span className={locals.controls}>{docLinkComponent}</span>;
}
