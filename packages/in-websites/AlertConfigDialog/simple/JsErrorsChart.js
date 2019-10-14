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

const twelfHours = 1000 * 60 * 60 * 12;

export default function JsErrorsChart({ form }) {
  const timeConfig = {
    windowSize: twelfHours
  };

  const tagFilters = form.get(fieldNames.tagFilters).value;

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
            tagFilters,
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
  form: PropTypes.object.isRequired
};

function hasJsErrorSelected(form) {
  return !!(form && form.get(fieldNames.value).value);
}
