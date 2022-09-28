/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  outdated_go_runtime: {
    issueDescription: {
      Component: function goRuntimeNeedsUpdate({ url }) {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.golangRuntimePlatform.goRuntimeNeedsUpdate" values={{ url }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.golangRuntimePlatform.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/current?topic=technologies-monitoring-go#troubleshooting`
  }
};
