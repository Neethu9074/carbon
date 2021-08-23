/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  envoy_access_metrics_endpoint_failed: {
    issueDescription: {
      Component: function envoyMonitoringRequiresConfiguredAdminInterface() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.envoy.envoyMonitoringRequiresConfiguredAdminInterface" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.envoy.troubleshootingDocs'),
    explanationLinkHref: `https://www.instana.com/docs/ecosystem/envoy/#envoy_access_metrics_endpoint_failed`
  },
  envoy_missing_configuration_admin_address_path: {
    issueDescription: {
      Component: function envoyMonitoringRequiresAdminAddressPath() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.envoy.envoyMonitoringRequiresAdminAddressPath" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.envoy.troubleshootingDocs'),
    explanationLinkHref: `https://www.instana.com/docs/ecosystem/envoy/#envoy_missing_configuration_admin_address_path`
  }
};
