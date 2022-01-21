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
    // TODO verify if it's ok it's missing #metrics_include_regex_does_not_match_any_metric!
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-hcl-domino`
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
    // TODO verify if it's ok it's missing #invalid_metrics_file_location!
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-hcl-domino`
  }
};
