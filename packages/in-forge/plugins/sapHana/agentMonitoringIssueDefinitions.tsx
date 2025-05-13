/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  sapHana_old_config_used: {
    issueDescription: {
      Component: function oldConfigUsed() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.sapHana.oldConfigUsed" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.sapHana.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/latest?topic=sap-monitoring-hana`
  },
  sapHana_unable_to_connect: {
    issueDescription: {
      Component: function UnableToConnect({
        connectionUrl,
        dbName,
        user
      }: {
        connectionUrl: string;
        dbName: string;
        user: string;
      }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.sapHana.unableToConnect"
              values={{ connectionUrl: connectionUrl, dbName: dbName, user: user }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.sapHana.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/latest?topic=sap-monitoring-hana`
  }
};
