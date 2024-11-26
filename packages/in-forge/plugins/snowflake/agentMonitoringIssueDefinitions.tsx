/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  snowflake_region_operational_issues: {
    issueDescription: {
      Component: function snowflakeRegionOperationalIssues({ error }: { error: string }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.snowflake.connectErrorIssueDescription"
              components={{
                code: <code />
              }}
              values={{ error: error }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.snowflake.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/BdaQaQ`
  }
};
