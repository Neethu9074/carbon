/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Card, Stack, SvgIcon, Tooltip, Typography, ButtonGroup } from '@instana/components';

// @ts-expect-error File needs to be migrated to typescript
import UsageChart from 'in-amp/components/UsageChart';
import { carbonAlert } from 'in-themes/chartColors';
import { t, Trans } from 'in-i18n';

const BUCKET30DAYS = 'bucket30Days';
const BUCKET60DAYS = 'bucket60Days';
const BUCKET90DAYS = 'bucket90Days';
// The order of the object will be how the buttons will be generated.
export const ADDON_METRIC = {
  [BUCKET30DAYS]: {
    CONSUMPTION: 'logging_retention_30_days_bytes',
    TOTAL: 'licensed_logging_retention_bucket_30_days',
    KEY: 'bucket30Days',
    LABEL: '30 days'
  },
  [BUCKET60DAYS]: {
    CONSUMPTION: 'logging_retention_60_days_bytes',
    TOTAL: 'licensed_logging_retention_bucket_60_days',
    KEY: 'bucket60Days',
    LABEL: '60 days'
  },
  [BUCKET90DAYS]: {
    CONSUMPTION: 'logging_retention_90_days_bytes',
    TOTAL: 'licensed_logging_retention_bucket_90_days',
    KEY: 'bucket90Days',
    LABEL: '90 days'
  }
};

const RetentionAddonChart = ({
  onPremLicenseInformationEnabled,
  tenantUnit,
  windowSize,
  timeRange,
  to,
  showAggregatedMetrics,
  hasLoggingAddon
}: RetentionAddonChartProp) => {
  const [loggingRetention, setLoggingRetention] = useState(setInititalLoggingRetention(hasLoggingAddon));

  // Logging Addon Chart Y1 and Y2 definitions
  const LoggingAddonChartY1 = {
    ...tenantUnit,
    metrics: [loggingRetention?.consumption],
    labels: [t('in-amp:components.usageCharts.consumedData')],
    colors: ['#17A1E6'],
    formatter: 'bytes.compact'
  };

  const LoggingAddonChartY2 = {
    ...tenantUnit,
    metrics: [loggingRetention?.total],
    labels: [t('in-amp:components.usageCharts.entitledData')],
    colors: [carbonAlert.red60],
    formatter: 'bytes.compact'
  };

  return (
    <Card
      leftHeaderContent={
        <Stack direction="horizontal" align="center" gap="xxsmall">
          <Typography variant="heading-300" noMargin>
            {t('in-amp:components.usageCharts.logging')}
          </Typography>
          <Tooltip
            content={
              onPremLicenseInformationEnabled ? (
                <Trans i18nKey="in-amp:components.usageCharts.loggingHelperText.onprem" />
              ) : (
                <Trans i18nKey="in-amp:components.usageCharts.loggingHelperText.saas" />
              )
            }
            align="auto"
          >
            <SvgIcon type="lib_help_error_info_outline" size="s" color="#172429" />
          </Tooltip>
        </Stack>
      }
      rightHeaderContent={
        <ButtonGroup activeKey="1" buttonPropsList={generateButtonPropsList(hasLoggingAddon, setLoggingRetention)} />
      }
    >
      <UsageChart
        windowSize={windowSize}
        timeRange={timeRange}
        to={to}
        showAggregatedMetrics={showAggregatedMetrics}
        y1={LoggingAddonChartY1}
        y2={LoggingAddonChartY2}
      />
    </Card>
  );
};

export default RetentionAddonChart;

type HasLoggingAddonProp = Array<typeof BUCKET30DAYS | typeof BUCKET60DAYS | typeof BUCKET90DAYS> | null;

interface RetentionAddonChartProp {
  onPremLicenseInformationEnabled: boolean;
  tenantUnit: any;
  windowSize: any;
  timeRange: any;
  to: any;
  showAggregatedMetrics: any;
  hasLoggingAddon: HasLoggingAddonProp;
}

type setLoggingRetentionType = React.Dispatch<
  React.SetStateAction<{
    consumption: string;
    total: string;
  } | null>
>;

/**
 * This function sets the initial value for the state that helps render the
 * addon chart.
 * @param loggingAddonDetails
 * @returns An object with "consumption" & "total" keys
 */
const setInititalLoggingRetention = (hasLoggingAddon: HasLoggingAddonProp) => {
  const addonDayOrder = Object.keys(ADDON_METRIC) as Array<keyof typeof ADDON_METRIC>;

  for (let addonDay of addonDayOrder) {
    if (hasLoggingAddon?.includes(addonDay)) {
      const metric = ADDON_METRIC[addonDay];
      return {
        consumption: metric.CONSUMPTION,
        total: metric.TOTAL
      };
    }
  }

  return null;
};

/**
 * This function pushes value to an array which is used to generate the button group dynamically.
 * @param loggingAddonDetails
 * @param setLoggingRetention
 * @returns
 */
const generateButtonPropsList = (
  hasLoggingAddon: HasLoggingAddonProp,
  setLoggingRetention: setLoggingRetentionType
) => {
  let buttonPropsList: { key: string; onClick: () => void; text: string }[] = [];
  let i = 1;
  (Object.keys(ADDON_METRIC) as Array<keyof typeof ADDON_METRIC>).forEach(key => {
    if (hasLoggingAddon && hasLoggingAddon.includes(key)) {
      buttonPropsList.push({
        key: `${i++}`,
        onClick: () => {
          setLoggingRetention({
            consumption: ADDON_METRIC[key].CONSUMPTION,
            total: ADDON_METRIC[key].TOTAL
          });
        },
        text: ADDON_METRIC[key].LABEL
      });
    }
  });
  return buttonPropsList;
};
