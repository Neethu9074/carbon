/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
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
    explanationLinkHref: `https://instana.com/docs/ecosystem/domino/#metrics_include_regex_does_not_match_any_metric`
  },

  missing_stat_pub_configuration_parameters: {
    issueDescription: {
      Component: function missingStatPubConfigurationParameters() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.domino.missingStatPubConfigurationParameters" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.domino.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/domino/#missing_stat_pub_configuration_parameters`
  },

  invalid_metrics_file_location: {
    issueDescription: {
      Component: function invalidMetricsFileLocation() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.domino.invalidMetricsFileLocation" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.domino.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/domino/#invalid_metrics_file_location`
  }
};
