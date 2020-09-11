import theme from 'in-themes';
import React from 'react';

import UsageTimeConfigContextModification from 'in-amp/components/UsageTimeConfigContextModification';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import { getAccountAsResultObservable } from 'in-amp/api/account';
import AmpTimeSelection from 'in-amp/components/TimeSelection';
import { hasError, isLoading } from 'in-services/util/result';
import ApiItemView from 'in-settings/components/ApiItemView';
import { pendingResult } from 'in-services/fixedObjects';
import { Row, Col } from 'in-new-components/layout/Grid';
import UsageChart from 'in-amp/components/UsageChart';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import useUrlState from 'in-hooks/useUrlState';
import Card from 'in-new-components/Card';
import Title from 'in-components/Title';

import locals from './Usage.mless';

const usageUrlStateDefinition = {
  bind: [
    {
      path: '/usage',
      name: 'tenantUnit',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser()
    }
  ]
};

export default function TimeRestrictedUsageWrapper() {
  const timeConfig = useTimeConfig();
  const accountResult = useObservable(getAccountAsResultObservable(), []);

  const [{ tenantUnit }, onChange] = useUrlState(usageUrlStateDefinition);

  if (!accountResult || hasError(accountResult) || isLoading(accountResult)) {
    return <ApiItemView hideFooter result={accountResult ?? pendingResult} />;
  }

  const aggregatedOption = { label: 'All units (aggregated)' };
  const showAggregatedMetrics = tenantUnit.label === aggregatedOption.label;
  return (
    <UsageTimeConfigContextModification timeConfig={timeConfig} showAggregatedMetrics={showAggregatedMetrics}>
      <Usage
        tenantUnits={[
          aggregatedOption,
          ...accountResult.data.environments.map(({ tenant, unit }) => ({
            label: `${tenant}-${unit}`,
            tenant,
            unit
          }))
        ]}
        showAggregatedMetrics={showAggregatedMetrics}
        tenantUnit={tenantUnit || aggregatedOption}
        setTenantUnit={tu => onChange({ tenantUnit: tu })}
      />
    </UsageTimeConfigContextModification>
  );
}

function Usage({ tenantUnits, showAggregatedMetrics, tenantUnit, setTenantUnit }) {
  const unitSelectorOptions = tenantUnits.map(({ label, tenant, unit }) => ({
    label,
    value: { tenant, unit, label }
  }));

  return (
    <>
      <Title title="Company Information" />

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
        </HorizontalFlexWrapper>
        {!showAggregatedMetrics && <AmpTimeSelection />}
      </div>

      <form>
        <Row>
          <Col xs={12}>
            <Card title="APM Usage">
              <UsageChart
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
        </Row>
        <Row>
          <Col xs={12}>
            <Card title="Infra Usage">
              <UsageChart
                showAggregatedMetrics={showAggregatedMetrics}
                y1={{
                  ...tenantUnit,
                  metrics: ['infrahost'],
                  labels: ['Infra Hosts']
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
          <Col xs={12}>
            <Card title="Container Usage">
              <UsageChart
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
        </Row>
      </form>
    </>
  );
}
