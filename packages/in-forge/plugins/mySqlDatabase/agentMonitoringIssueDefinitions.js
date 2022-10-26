/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  innodb_trx_metrics_not_enabled: {
    issueDescription: {
      Component: function innodbTrxMetricsNotEnabled({ columns }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.mySqlDatabase.innodbTrxMetricsNotEnabledIssueDescription"
              components={{
                code: <code />,
                strong: <strong />
              }}
              values={{ columns: columns }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.mySqlDatabase.troubleshootingDocs'),
    explanationLinkHref: `https://dev.mysql.com/doc/refman/5.7/en/innodb-information-schema-metrics-table.html`
  }
};
