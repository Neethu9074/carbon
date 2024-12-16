/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  tibcoas_ftl_connect_error: {
    issueDescription: {
      Component: function tibcoasFtlConnectionError({ error }: { error: string }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.tibcoASProxy.connectErrorIssueDescription"
              components={{
                code: <code />
              }}
              values={{ error: error }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.tibcoASProxy.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/Bdv3VD`
  }
};
