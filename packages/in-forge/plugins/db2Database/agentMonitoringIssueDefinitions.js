/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  db2luw_unable_to_connect: {
    issueDescription: {
      Component: function UnableToConnect({ connectionUrl, user }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.db2Database.UnableToConnect"
              values={{ connectionUrl: connectionUrl, user: user }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.db2Database.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/db2`
  }
};
