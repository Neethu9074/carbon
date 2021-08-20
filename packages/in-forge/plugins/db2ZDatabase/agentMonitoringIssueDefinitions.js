/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  db2z_unable_to_connect: {
    issueDescription: {
      Component: function UnableToConnect({ connectionUrl, user }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.db2ZDatabase.UnableToConnect"
              values={{ connectionUrl: connectionUrl, user: user }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.db2ZDatabase.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/db2z`
  },
  db2z_unable_to_get_data: {
    issueDescription: {
      Component: function UnableToGetData() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.db2ZDatabase.UnableToGetData" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.db2ZDatabase.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/db2z`
  }
};
