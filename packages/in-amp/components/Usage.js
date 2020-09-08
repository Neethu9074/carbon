import React, { useState } from 'react';
import theme from 'in-themes';

import UsageTimeConfigContextModification from 'in-amp/components/UsageTimeConfigContextModification';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import { getCompanyInfoAsResultObservable } from 'in-amp/api/companyInfo';
import AmpTimeSelection from 'in-amp/components/TimeSelection';
import { hasError, isLoading } from 'in-services/util/result';
import ApiItemView from 'in-settings/components/ApiItemView';
import { pendingResult } from 'in-services/fixedObjects';
import { Row, Col } from 'in-new-components/layout/Grid';
import UsageChart from 'in-amp/components/UsageChart';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import Dropdown from 'in-new-components/Dropdown';
import Button from 'in-new-components/Button';
import Card from 'in-new-components/Card';
import Title from 'in-components/Title';

import locals from './Usage.mless';

export default function TimeRestrictedUsageWrapper() {
  const timeConfig = useTimeConfig();
  const [showAggregatedMetrics, setShowAggregatedMetrics] = useState(true);
  const companyInfoResult = useObservable(getCompanyInfoAsResultObservable(), []);

  if (!companyInfoResult || hasError(companyInfoResult) || isLoading(companyInfoResult)) {
    return <ApiItemView hideFooter result={companyInfoResult ?? pendingResult} />;
  }

  return (
    <UsageTimeConfigContextModification timeConfig={timeConfig} showAggregatedMetrics={showAggregatedMetrics}>
      <Usage
        tenantUnits={companyInfoResult.data.environments}
        showAggregatedMetrics={showAggregatedMetrics}
        setShowAggregatedMetrics={setShowAggregatedMetrics}
      />
    </UsageTimeConfigContextModification>
  );
}

function Usage({ tenantUnits, showAggregatedMetrics, setShowAggregatedMetrics }) {
  const [tenantUnit, setTenantUnit] = useState(tenantUnits[0]);

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
            <Dropdown
              className={locals.dropdown}
              label={`${tenantUnit.tenant}-${tenantUnit.unit}`}
              asSimpleDropdown
              items={tenantUnits.map(({ tenant, unit }) => ({ label: `${tenant}-${unit}`, tenant, unit }))}
              onChange={({ tenant, unit }) => setTenantUnit({ tenant, unit })}
            />
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
