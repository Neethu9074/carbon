import theme from 'in-themes';
import React from 'react';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import { getAccountAsResultObservable } from 'in-amp/api/account';
import AmpTimeSelection from 'in-amp/components/TimeSelection';
import { hasError, isLoading } from 'in-services/util/result';
import QueuedLicenses from 'in-amp/components/QueuedLicenses';
import ApiItemView from 'in-settings/components/ApiItemView';
import { pendingResult } from 'in-services/fixedObjects';
import { Row, Col } from 'in-new-components/layout/Grid';
import UsageChart from 'in-amp/components/UsageChart';
import { tenantUnitChanged } from 'in-amp/tracker';
import useObservable from 'in-hooks/useObservable';
import Licenses from 'in-amp/components/Licenses';
import Message from 'in-new-components/Message';
import useUrlState from 'in-hooks/useUrlState';
import Card from 'in-new-components/Card';
import { days } from 'in-services/time';
import Title from 'in-components/Title';

import locals from './Usage.mless';

const aggregatedState = { label: 'All units (aggregated)' };

export default function UsageWithAccountInfo() {
  const accountResult = useObservable(getAccountAsResultObservable(), []);
  if (!accountResult || hasError(accountResult) || isLoading(accountResult)) {
    return <ApiItemView hideFooter result={accountResult ?? pendingResult} />;
  }

  return <Usage environments={accountResult.data.environments} />;
}

function Usage({ environments }) {
  const unitSelectorOptions = environments.map(({ tenant, unit }) => {
    const label = `${unit}-${tenant}`;
    return {
      label,
      value: { tenant, unit, label }
    };
  });

  const canShowAggregatedMetrics = containsPaidLicenses(environments);
  const initialState = canShowAggregatedMetrics ? aggregatedState : unitSelectorOptions[0].value;
  const [{ tenantUnit, windowSize }, onChange] = useUrlState({
    bind: [
      {
        path: '/usage',
        name: 'tenantUnit',
        serializer: buildJsonSerializer(),
        parser: buildJsonParser(),
        initialState
      },
      {
        path: '/usage',
        name: 'windowSize',
        serializer: buildJsonSerializer(),
        parser: buildJsonParser(),
        initialState: days.toMillis(30)
      }
    ]
  });
  const setTenantUnit = _tenantUnit => {
    tenantUnitChanged(_tenantUnit);
    onChange({ tenantUnit: _tenantUnit });
  };
  const setWindowSize = _windowSize => onChange({ windowSize: _windowSize });

  const showAggregatedMetrics = tenantUnit.label === aggregatedState.label;
  if (canShowAggregatedMetrics) {
    unitSelectorOptions.unshift({ label: aggregatedState.label, value: { label: aggregatedState.label } });
  }

  return (
    <>
      <Title title="Account Usage" />

      <div className={locals.buttonHeader}>
        <HorizontalFlexWrapper>
          <ComboBoxBehavior
            align="bottomRight"
            value={unitSelectorOptions.find(({ label }) => label === tenantUnit.label)?.value}
            options={unitSelectorOptions}
            onChange={setTenantUnit}
            disableAutomaticOptionSorting
          >
            {({ elementProps, isOpen }) => (
              <DropdownButton {...elementProps} kind="secondary" expanded={isOpen}>
                {tenantUnit.label}
              </DropdownButton>
            )}
          </ComboBoxBehavior>
          {showAggregatedMetrics && (
            <Message
              className={locals.message}
              withIcon
              title="Customer usage is reported across all units of your Account with a paid license."
            />
          )}
        </HorizontalFlexWrapper>
        {!showAggregatedMetrics && <AmpTimeSelection windowSize={windowSize} setWindowSize={setWindowSize} />}
      </div>

      <form>
        <Row>
          <Col xs={6}>
            <Card title="APM Usage">
              <UsageChart
                windowSize={windowSize}
                showAggregatedMetrics={showAggregatedMetrics}
                y1={{ ...tenantUnit, metrics: ['apmhost'], labels: ['APM Hosts'] }}
                y2={{
                  ...tenantUnit,
                  metrics: ['licensed_apm_hosts'],
                  labels: ['Purchased'],
                  colors: [theme.lib.colors.failure]
                }}
              />
            </Card>
          </Col>
          <Col xs={6}>
            <Card title="Infrastructure Usage">
              <UsageChart
                windowSize={windowSize}
                showAggregatedMetrics={showAggregatedMetrics}
                y1={{
                  ...tenantUnit,
                  metrics: ['infrahost'],
                  labels: ['IQM Hosts']
                }}
                y2={{
                  ...tenantUnit,
                  metrics: ['licensed_infra_hosts'],
                  labels: ['Purchased'],
                  colors: [theme.lib.colors.failure]
                }}
              />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <Card title="Container Usage">
              <UsageChart
                windowSize={windowSize}
                showAggregatedMetrics={showAggregatedMetrics}
                y1={{
                  ...tenantUnit,
                  metrics: ['docker', 'containerd', 'crio', 'garden', 'lxc'],
                  labels: ['Docker', 'ContainerD', 'Crio', 'Garden', 'LXC'],
                  renderer: 'stackedArea'
                }}
                y2={{
                  ...tenantUnit,
                  metrics: ['licensed_container'],
                  labels: ['Purchased'],
                  colors: [theme.lib.colors.failure]
                }}
              />
            </Card>
          </Col>
          <Col xs={6}>
            <Card title="Serverless Usage">
              <UsageChart
                windowSize={windowSize}
                showAggregatedMetrics={showAggregatedMetrics}
                y1={{
                  ...tenantUnit,
                  metrics: ['tracingserverless'],
                  labels: ['Serverless']
                }}
                y2={{
                  ...tenantUnit,
                  metrics: ['licensed_tracingserverless'],
                  labels: ['Purchased'],
                  colors: [theme.lib.colors.failure]
                }}
              />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Card title="Active Licenses">
              <Licenses />
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
      </form>
    </>
  );
}

function containsPaidLicenses(environments) {
  for (let i = 0; i < environments.length; i++) {
    const licenses = environments[i].licenses ?? [];
    for (let i2 = 0; i2 < licenses.length; i2++) {
      const license = licenses[i2];
      if (license.paid) {
        return true;
      }
    }
  }
  return false;
}
