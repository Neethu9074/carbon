/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { t } from 'in-i18n';

import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import StackTrace from 'in-websites/WebsiteDashboard/tabs/Errors/StackTrace';

import locals from './Stack.mless';

export default function Stack({ beacon }) {
  return (
    <StackTrace
      websiteId={beacon.websiteId}
      stackTrace={beacon.stackTrace}
      parsedStackTrace={beacon.parsedStackTrace}
      stackTraceParsingStatus={beacon.stackTraceParsingStatus}
      buttonSize="compact"
    >
      {({ actions, content }) => (
        <Fragment>
          <div className={locals.header}>
            <BodyHeader>{t('in-websites:analyze.analyzeView.pageLoadView.stackTrace')}</BodyHeader>

            <div className={locals.actions}>{actions}</div>
          </div>
          {content}
        </Fragment>
      )}
    </StackTrace>
  );
}
