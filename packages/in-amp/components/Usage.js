/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import NoLicenseAvailableMessage from 'in-amp/components/NoLicenseAvailableMessage';
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
  return (
    <WithAccountInformation>
      {props => (props.unitSelectorOptions?.length === 0 ? <NoLicenseAvailableMessage /> : <Usage {...props} />)}
    </WithAccountInformation>
  );
}

function Usage({ unitSelectorOptions, getCurrentTenantOption, canShowAggregatedMetrics }) {
  const initialState =
    (canShowAggregatedMetrics ? aggregatedState : getCurrentTenantOption(unitSelectorOptions)?.value) ??
    aggregatedState;
  const { windowSize, setWindowSize, tenantUnit, setTenantUnit } = useAmpUrlInformation(initialState);

  const showAggregatedMetrics = tenantUnit.label === aggregatedState.label;
  if (canShowAggregatedMetrics) {
    unitSelectorOptions = unitSelectorOptions.slice();
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
