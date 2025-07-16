/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  db2oni_collection_services_not_enabled: {
    issueDescription: {
      Component: function db2OnICollectionServicesNotEnabled() {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.ibmIDb2.collectionServicesNotEnabledDescription"
              components={{
                code: <code />,
                strong: <strong />
              }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.ibmIDb2.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/latest?topic=technologies-monitoring-db2-i#collection-services-configuring-and-startup`
  },
  ibmi_unable_to_connect: {
    issueDescription: {
      Component: function UnableToConnect({ host, user }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.ibmIDb2.unableToConnect"
              values={{ host: host, user: user }}
              components={{
                code: <code />,
                strong: <strong />
              }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.ibmIDb2.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/monitoring-ibmi`
  }
};
