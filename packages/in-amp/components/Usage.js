import React from 'react';

import UsageTimeConfigContextModification from 'in-amp/components/UsageTimeConfigContextModification';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import { getCompanyInfoAsResultObservable } from 'in-amp/api/companyInfo';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import AmpTimeSelection from 'in-amp/components/TimeSelection';
import { hasError, isLoading } from 'in-services/util/result';
import ApiItemView from 'in-settings/components/ApiItemView';
import { pendingResult } from 'in-services/fixedObjects';
import { Row, Col } from 'in-new-components/layout/Grid';
import UsageChart from 'in-amp/components/UsageChart';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import useUrlState from 'in-hooks/useUrlState';
import Button from 'in-new-components/Button';
import Card from 'in-new-components/Card';
import Title from 'in-components/Title';
import theme from 'in-themes';

import locals from './Usage.mless';

const timeRestrictedUsageWrapperUrlStateDefinition = {
  bind: [
    {
      path: '/usage',
      name: 'showAggregatedMetrics',
      parser: v => v === 'true',
      initialState: true
    }
  ]
};

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
  const [{ showAggregatedMetrics }, setState] = useUrlState(timeRestrictedUsageWrapperUrlStateDefinition);
  const companyInfoResult = useObservable(getCompanyInfoAsResultObservable(), []);

  if (!companyInfoResult || hasError(companyInfoResult) || isLoading(companyInfoResult)) {
    return <ApiItemView hideFooter result={companyInfoResult ?? pendingResult} />;
  }

  return (
    <UsageTimeConfigContextModification timeConfig={timeConfig} showAggregatedMetrics={showAggregatedMetrics}>
      <Usage
        tenantUnits={companyInfoResult.data.environments}
        showAggregatedMetrics={showAggregatedMetrics}
        setShowAggregatedMetrics={showAggregatedMetrics => setState({ showAggregatedMetrics })}
      />
    </UsageTimeConfigContextModification>
  );
}

function Usage({ tenantUnits, showAggregatedMetrics, setShowAggregatedMetrics }) {
  const [state, setState] = useUrlState(usageUrlStateDefinition);
  const tenantUnit = state.tenantUnit || tenantUnits[0];
  const unitSelectorOptions = tenantUnits.map(({ tenant, unit }) => ({
    label: `${tenant}-${unit}`,
    value: { tenant, unit }
  }));

  return (
    <>
      <Title title="Company Information" />

      <div className={locals.buttonHeader}>
        <HorizontalFlexWrapper>
          <Button
            kind={showAggregatedMetrics ? 'primaryv2' : 'secondary'}
            onClick={() => setShowAggregatedMetrics(!showAggregatedMetrics)}
          >
            {`${showAggregatedMetrics ? 'Show single unit metrics' : 'Show aggregated metrics'}`}
          </Button>
          {!showAggregatedMetrics && (
            <ComboBoxBehavior
              align="bottomRight"
              value={
                unitSelectorOptions.find(
                  ({ value: { tenant, unit } }) => tenant === tenantUnit.tenant && unit === tenantUnit.unit
                )?.value
              }
              options={unitSelectorOptions}
              onChange={tenantUnit => setState({ tenantUnit })}
              disableAutomaticOptionSorting
            >
              {({ elementProps, isOpen }) => (
                <DropdownButton {...elementProps} kind="secondary" expanded={isOpen}>
                  {tenantUnit.tenant}-{tenantUnit.unit}
                </DropdownButton>
              )}
            </ComboBoxBehavior>
          )}
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
