/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  compute_instance_get_permission_missing: {
    issueDescription: {
      Component: function computeInstanceGetPermissionMissing() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.gce.computeInstanceGetPermissionMissing" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.gce.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem//google-compute-engine/#compute_instance_get_permission_missing`
  }
};
