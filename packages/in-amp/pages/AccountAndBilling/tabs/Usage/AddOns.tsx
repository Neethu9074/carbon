/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Stack, SvgIcon, Typography } from '@instana/components';
import { Card } from '@instana/components';

//@ts-expect-error - Cannot find module
import AmpInformationModifier from 'in-amp/components/AmpInformationModifier';
// @ts-expect-error needs TS migration
import WithAccountInformation from 'in-amp/components/WithAccountInformation';
//@ts-expect-error - Cannot find module
import useAmpUrlInformation from 'in-amp/hooks/useAmpUrlInformation';
//@ts-expect-error - Cannot find module
import UsageChart from 'in-amp/components/UsageChart';
import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';
import RetentionAddonChart from 'in-amp/components/RetentionAddonChart';
import { Row, Col } from 'in-components/layout/Grid';
import { carbonAlert } from 'in-themes/chartColors';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-amp/pages/AccountAndBilling/AccountAndBilling.mless';

type AddOnProps = {
  hasLoggingAddon: boolean;
  hasSyntheticAddon: boolean;
};

export default function AddOnContainer() {
  return (
    <WithAccountInformation>
      {({ hasSyntheticAddon, hasLoggingAddon }: AddOnProps) => (
        <AddOns hasSyntheticAddon={hasSyntheticAddon} hasLoggingAddon={hasLoggingAddon} />
      )}
    </WithAccountInformation>
  );
}

function AddOns(props: any) {
  const aggregatedState = {
    label: t('in-amp:components.usages.allPaidUnitsAggregated')
  };
  const tenantUnit = aggregatedState;
  const { windowSize, setWindowSize, timeRange, setTimeRange, to, setTo, presentation, setPresentation } =
    useAmpUrlInformation(aggregatedState);

  const isCumulativeTimeRange =
    presentation === 'cumulative' && (timeRange === 'this_month' || timeRange === 'last_month');

  return (
    <div className={locals.bottomMargin}>
      <AmpInformationModifier
        unitSelectorOptions={[aggregatedState]}
        windowSize={windowSize}
        setWindowSize={setWindowSize}
        tenantUnit={tenantUnit}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        setTo={setTo}
        presentation={presentation}
        setPresentation={setPresentation}
        isAddOn
      />
      {props.hasSyntheticAddon && (
        <Row>
          <Col xs={12}>
            <Card
              leftHeaderContent={
                <Stack direction="horizontal" align="center" gap="xxsmall">
                  <Typography variant="heading-300" noMargin>
                    {t('in-amp:components.usageCharts.syntheticPops')}
                  </Typography>
                  <Tooltip content={t('in-amp:components.usageCharts.syntheticsHelperText')} align="auto" legacy>
                    <SvgIcon type="lib_help_error_info_outline" size="s" color="#172429" />
                  </Tooltip>
                </Stack>
              }
            >
              <UsageChart
                windowSize={windowSize}
                timeRange={timeRange}
                to={to}
                showAggregatedMetrics
                y1={{
                  ...tenantUnit,
                  metrics: ['syntheticstotal'],
                  labels: [t('in-amp:components.usageCharts.consumedUnits')],
                  colors: ['#17A1E6']
                }}
                y2={{
                  ...tenantUnit,
                  metrics: ['licensed_synthetic_managed_pops'],
                  labels: [t('in-amp:components.usageCharts.resourceUnits')],
                  colors: [carbonAlert.red60]
                }}
              />
            </Card>
          </Col>
        </Row>
      )}
      {props.hasLoggingAddon && (
        <Row>
          <Col xs={12}>
            <RetentionAddonChart
              onPremLicenseInformationEnabled={onPremLicenseInformationEnabled}
              isCumulativeTimeRange={isCumulativeTimeRange}
              tenantUnit={tenantUnit}
              windowSize={windowSize}
              timeRange={timeRange}
              to={to}
              showAggregatedMetrics
              hasLoggingAddon={props.hasLoggingAddon}
            />
          </Col>
        </Row>
      )}
    </div>
  );
}
