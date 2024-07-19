/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  prometheus_metric_parse_error: {
    issueDescription: {
      Component: function prometheusMetricParseError({ line, position, message }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.prometheus.prometheusMetricParseErrorIssueDescription"
              components={{
                code: <code />
              }}
              values={{
                line: line,
                position: position,
                message: message.slice(0, 240)
              }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.prometheus.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/prometheus-parse-error`
  }
};
