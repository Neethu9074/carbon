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
    explanationLinkHref: `https://instana.com/docs/ecosystem/traefik/#traefik_api_not_accessible`
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
    explanationLinkHref: `https://instana.com/docs/ecosystem/traefik/#traefik_api_not_enabled`
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
    explanationLinkHref: `https://instana.com/docs/ecosystem/traefik/#traefik_tracing_not_enabled`
  }
};
