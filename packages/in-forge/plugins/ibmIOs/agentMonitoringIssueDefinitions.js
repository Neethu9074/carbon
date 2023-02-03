/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  ibmi_unable_to_connect: {
    issueDescription: {
      Component: function UnableToConnect({ host, user }) {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.ibmIOs.unableToConnect" values={{ host: host, user: user }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.ibmIOs.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-i-instances`
  }
};
