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
    explanationLinkHref: `https://instana.com/docs/ecosystem/ibmidb2#configuring-and-starting-collection-services`
  }
};
