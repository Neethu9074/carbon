import PropTypes from 'prop-types';
import React from 'react';

import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper.js';
import { fieldNames } from 'in-websites/AlertConfigDialog/form/alertDialogFormDefinition';
import { getChartGranularity } from 'in-applications/metrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';
import theme from 'in-themes';

import locals from './JsErrorsChart.mless';

export default function JsErrorsChart({ form, timeConfig }) {
  return (
    <div className={locals.container}>
      {hasJsErrorSelected(form) ? (
        <WebsiteChartWrapper
          timeConfig={timeConfig}
          y1={{
            colors: [theme.lib.colors.primary2],
            renderer: Renderer.bar,
            formatter: number.forcedCompact,
            labels: ['Historical data'],
            metricIds: ['errors']
          }}
          metricsConfiguration={{
            timeConfig,
            tagFilters: [
              {
                name: 'beacon.error.message',
                operator: form.get(fieldNames.operator).value,
                stringValue: form.get(fieldNames.value).value
              },
              ...form.get(fieldNames.tagFilters).value
            ],
            metrics: {
              errors: {
                metric: 'errors',
                granularity: getChartGranularity(timeConfig),
                aggregation: 'SUM'
              }
            }
          }}
        />
      ) : (
        <div className={locals.message}>
          <SvgIcon type="lib_help_error_error_outline" size="xs" />
          <span>Please select a JS Error to see when this alert triggers</span>
        </div>
      )}
    </div>
  );
}

JsErrorsChart.propTypes = {
  form: PropTypes.object.isRequired,
  timeConfig: PropTypes.object.isRequired
};

function hasJsErrorSelected(form) {
  return !!(form && form.get(fieldNames.value).value);
}
