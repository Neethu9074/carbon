/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  traefik_metrics_api_not_accessible: {
    issueDescription: {
      Component: function traefikMetricsApiNotAccessible({ url }) {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.traefik.traefikMetricsApiNotAccessible" values={{ url }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.traefik.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-traefik#troubleshooting`
  },
  traefik_metrics_api_not_enabled: {
    issueDescription: {
      Component: function traefikMetricsApiNotEnabled() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.traefik.traefikMetricsApiNotEnabled" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.traefik.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-traefik#troubleshooting`
  },
  traefik_tracing_not_enabled: {
    issueDescription: {
      Component: function traefikTracingNotEnabled() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.traefik.traefikTracingNotEnabled" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.traefik.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-traefik#troubleshooting`
  }
};
