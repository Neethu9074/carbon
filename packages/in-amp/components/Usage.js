import React from 'react';

import AmpInformationModifier from 'in-amp/components/AmpInformationModifier';
import WithAccountInformation from 'in-amp/components/WithAccountInformation';
import useAmpUrlInformation from 'in-amp/hooks/useAmpUrlInformation';
import ExpiredLicenses from 'in-amp/components/ExpiredLicenses';
import QueuedLicenses from 'in-amp/components/QueuedLicenses';
import ActiveLicenses from 'in-amp/components/ActiveLicenses';
import { Row, Col } from 'in-new-components/layout/Grid';
import UsageCharts from 'in-amp/components/UsageCharts';
import Card from 'in-new-components/Card';
import Title from 'in-components/Title';

const aggregatedState = { label: 'All paid units (aggregated)' };

export default function UsageWithAccountInfo() {
  return <WithAccountInformation>{props => <Usage {...props} />}</WithAccountInformation>;
}

function Usage({ unitSelectorOptions, canShowAggregatedMetrics }) {
  const initialState = (canShowAggregatedMetrics ? aggregatedState : unitSelectorOptions[0]?.value) ?? aggregatedState;
  const { windowSize, setWindowSize, tenantUnit, setTenantUnit } = useAmpUrlInformation('/usage', initialState);

  const showAggregatedMetrics = tenantUnit.label === aggregatedState.label;
  if (canShowAggregatedMetrics) {
    unitSelectorOptions.unshift({ label: aggregatedState.label, value: { label: aggregatedState.label } });
  }

  return (
    <>
      <Title title="Account Usage" />

      <AmpInformationModifier
        unitSelectorOptions={unitSelectorOptions}
        windowSize={windowSize}
        setWindowSize={setWindowSize}
        tenantUnit={tenantUnit}
        setTenantUnit={setTenantUnit}
      />

      <UsageCharts windowSize={windowSize} tenantUnit={tenantUnit} showAggregatedMetrics={showAggregatedMetrics} />

      <Row>
        <Col xs={12}>
          <Card title="Active Licenses">
            <ActiveLicenses />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card title="Expired Licenses">
            <ExpiredLicenses />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card title="Queued Licenses">
            <QueuedLicenses />
          </Card>
        </Col>
      </Row>
    </>
  );
}
