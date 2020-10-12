import React from 'react';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import { getAccountAsResultObservable } from 'in-amp/api/account';
import ExpiredLicenses from 'in-amp/components/ExpiredLicenses';
import AmpTimeSelection from 'in-amp/components/TimeSelection';
import { hasError, isLoading } from 'in-services/util/result';
import QueuedLicenses from 'in-amp/components/QueuedLicenses';
import ActiveLicenses from 'in-amp/components/ActiveLicenses';
import ApiItemView from 'in-settings/components/ApiItemView';
import { pendingResult } from 'in-services/fixedObjects';
import { Row, Col } from 'in-new-components/layout/Grid';
import UsageCharts from 'in-amp/components/UsageCharts';
import { tenantUnitChanged } from 'in-amp/tracker';
import useObservable from 'in-hooks/useObservable';
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

  return <Usage environments={accountResult.data.environments.filter(containsValidLicense)} />;
}

function Usage({ environments }) {
  const canShowAggregatedMetrics = containsPaidLicenses(environments);
  const unitSelectorOptions = environments.map(mapEnvironmentToComboBoxItem);

  const initialState = (canShowAggregatedMetrics ? aggregatedState : unitSelectorOptions[0]?.value) ?? aggregatedState;
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

function containsValidLicense(environment) {
  return containsActiveLicense(environment) || containsLicenseWhichIsNotOlderThan30Days(environment);
}

function containsActiveLicense({ activeLicenses = [] }) {
  return activeLicenses.length > 0;
}

function containsLicenseWhichIsNotOlderThan30Days({ expiredLicenses = [] }) {
  const now = Date.now();
  const thirtyDays = days.toMillis(30);

  for (const { expire } of expiredLicenses) {
    if (now - expire <= thirtyDays) {
      return true;
    }
  }
  return false;
}

function containsPaidLicenses(environments) {
  for (const { activeLicenses, expiredLicenses } of environments) {
    if (containsPaidLicense(activeLicenses) || containsPaidLicense(expiredLicenses)) {
      return true;
    }
  }
  return false;
}

function containsPaidLicense(licenses) {
  for (const { paid } of licenses) {
    if (paid) {
      return true;
    }
  }
  return false;
}

function mapEnvironmentToComboBoxItem({ tenant, unit }) {
  const label = `${unit}-${tenant}`;
  return {
    label,
    value: { tenant, unit, label }
  };
}
