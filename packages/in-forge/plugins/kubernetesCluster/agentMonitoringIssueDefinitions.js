import React from 'react';

export default {
  kubernetes_missing_permissions: {
    issueDescription: {
      Component: function kubernetesMissingPermissions({ appliesTo }) {
        return (
          <span>
            The Instana Agent ClusterRole is missing permissions for the following resources:{' '}
            <code>{appliesTo.join(', ')}</code>. Please update to the latest version of the Instana Agent YAML, Helm{' '}
            chart or Operator to ensure it has the most up-to-date permissions.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://www.instana.com/docs/ecosystem/kubernetes/#missing-clusterrole-permissions`
  }
};
