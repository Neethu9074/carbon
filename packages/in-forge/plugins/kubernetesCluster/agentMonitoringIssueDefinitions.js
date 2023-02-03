/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  kubernetes_missing_permissions: {
    issueDescription: {
      Component: function kubernetesMissingPermissions({ appliesTo }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.kubernetesCluster.theInstanaAgentClusterRoleIsMissing"
              values={{
                appliesTo: appliesTo.join(', ')
              }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.kubernetesCluster.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=instana-monitoring-kubernetes#missing-clusterrole-permissions`
  }
};
