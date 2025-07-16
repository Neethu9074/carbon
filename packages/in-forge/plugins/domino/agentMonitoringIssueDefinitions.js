/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  metrics_include_regex_does_not_match_any_metric: {
    issueDescription: {
      Component: function metricsIncludeRegexDoesNotMatchAnyMetric({ metrics_include }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.domino.metricsIncludeRegexDoesNotMatchAnyMetric"
              values={{ metrics_include: metrics_include }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.domino.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/latest?topic=technologies-monitoring-hcl-domino#metrics-include-regex-does-not-match-any-metrics`
  },

  missing_domino_stats_file: {
    issueDescription: {
      Component: function missingDominoStatsFile() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.domino.missingDominoStatsFile" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.domino.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/latest?topic=technologies-monitoring-hcl-domino#invalid-domino-metric-file-location`
  }
};
