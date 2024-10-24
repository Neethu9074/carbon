/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route } from 'react-router-dom';
import React from 'react';

import InfrastructureDataStatistics from 'in-internal/monitoringUnit/unit/InfrastructureDataStatistics';
import ApplicationDataStatistics from 'in-internal/monitoringUnit/unit/ApplicationDataStatistics';
import ProfileDataStatistics from 'in-internal/monitoringUnit/unit/ProfileDataStatistics';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import useGetHrefWithMutator from 'in-stores/navigation/hooks/useGetHrefWithMutator';
import { LinkList, LinkListItem } from 'in-internal/components/LinkList/LinkList';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import EntityStatistics from 'in-internal/monitoringUnit/unit/EntityStatistics';
import UnitsBreadcrumb from 'in-internal/monitoringUnit/units/UnitsBreadcrumb';
import InternalViewWrapper from 'in-internal/components/InternalViewWrapper';
import { linkToTenantUnit } from 'in-internal/components/crossUnitLinks';
import { canSeeExtendedInternalMonitoring } from 'in-stores/user';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import Landing from 'in-internal/monitoringUnit/unit/Landing';
import Logging from 'in-internal/monitoringUnit/unit/Logging';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import Switch from 'in-components/FragmentSupportingSwitch';
import Stan from 'in-internal/monitoringUnit/unit/Stan';
import Eum from 'in-internal/monitoringUnit/unit/Eum';
import { timeConfig$ } from 'in-stores/time/config';
import search from 'in-subscription/search';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './Unit.mless';

export default connectTo(({ location }) => {
  const tenant = getMatrixParameter(location, '/unit', 'tenant');
  const unit = getMatrixParameter(location, '/unit', 'unit');

  return {
    timeConfig: timeConfig$,
    tenantUnitId: timeConfig$
      .flatMap(timeConfig =>
        search({
          query: `entity.selfType:tenantUnit AND selfMonitoring.tenant:${tenant} AND selfMonitoring.unit:${unit}`,
          view: 'TABLE',
          timeConfig
        })
      )
      .map(results => results && results.first())
      .filter(Boolean)
  };
})(function Unit({ location, tenantUnitId, timeConfig }) {
  const tenant = getMatrixParameter(location, '/unit', 'tenant');
  const unit = getMatrixParameter(location, '/unit', 'unit');

  const getHref = useGetHrefWithMutator();

  return (
    <InternalViewWrapper>
      <Breadcrumbs
        items={[
          <UnitsBreadcrumb />,
          <Breadcrumb
            href={getHref(params => {
              params.pathname = '/internal/monitoringUnit/unit';
              setOrDeleteMatrixKey(params, '/unit', 'tenant', tenant);
              setOrDeleteMatrixKey(params, '/unit', 'unit', unit);
            })}
            label={t('in-internal:monitoringUnit.unit.tenantUnit.tenantUnitLabel')}
          >
            {tenant}-{unit}
          </Breadcrumb>
        ]}
      />

      <div className={locals.wrapper}>
        <div className={locals.left}>
          <Navigation tenant={tenant} unit={unit} />
        </div>
        <div className={locals.right}>
          {!tenantUnitId && <LoadingIndicator />}

          {tenantUnitId && (
            <Switch>
              <Route path="/internal/monitoringUnit/unit/entityStatistics">
                <EntityStatistics timeConfig={timeConfig} tenantUnitId={tenantUnitId} tenant={tenant} unit={unit} />
              </Route>
              <Route path="/internal/monitoringUnit/unit/applicationDataStatistics">
                <ApplicationDataStatistics
                  timeConfig={timeConfig}
                  tenantUnitId={tenantUnitId}
                  tenant={tenant}
                  unit={unit}
                />
              </Route>
              <Route path="/internal/monitoringUnit/unit/eum">
                <Eum timeConfig={timeConfig} tenantUnitId={tenantUnitId} tenant={tenant} unit={unit} />
              </Route>
              <Route path="/internal/monitoringUnit/unit/logging">
                <Logging timeConfig={timeConfig} tenantUnitId={tenantUnitId} tenant={tenant} unit={unit} />
              </Route>
              <Route path="/internal/monitoringUnit/unit/infrastructureDataStatistics">
                <InfrastructureDataStatistics
                  timeConfig={timeConfig}
                  tenantUnitId={tenantUnitId}
                  tenant={tenant}
                  unit={unit}
                />
              </Route>
              <Route path="/internal/monitoringUnit/unit/profileDataStatistics">
                <ProfileDataStatistics
                  timeConfig={timeConfig}
                  tenantUnitId={tenantUnitId}
                  tenant={tenant}
                  unit={unit}
                />
              </Route>
              <Route path="/internal/monitoringUnit/unit/stan">
                <Stan timeConfig={timeConfig} tenantUnitId={tenantUnitId} tenant={tenant} unit={unit} />
              </Route>
              <Route path="/internal/monitoringUnit/unit">
                <Landing timeConfig={timeConfig} tenantUnitId={tenantUnitId} tenant={tenant} unit={unit} />
              </Route>
            </Switch>
          )}
        </div>
      </div>
    </InternalViewWrapper>
  );
});

function Navigation({ tenant, unit }) {
  const getHref = useGetHrefWithMutator();

  return (
    <LinkList>
      <LinkListItem
        label={t('in-internal:monitoringUnit.unit.tenantUnit.home')}
        href={getHref(p => (p.pathname = '/internal/monitoringUnit/unit'))}
      />
      <LinkListItem
        label={t('in-internal:monitoringUnit.unit.tenantUnit.agents')}
        external
        href={linkToTenantUnit(
          getHref(params => (params.pathname = '/internal/thisUnit/agents')),
          tenant,
          unit
        )}
      />
      <LinkListItem
        label={t('in-internal:monitoringUnit.unit.tenantUnit.application')}
        href={getHref(p => (p.pathname = '/internal/monitoringUnit/unit/applicationDataStatistics'))}
      />
      <LinkListItem
        label={t('in-internal:monitoringUnit.unit.tenantUnit.endUserMonitor')}
        href={getHref(p => (p.pathname = '/internal/monitoringUnit/unit/eum'))}
      />
      <LinkListItem
        label={t('in-internal:monitoringUnit.unit.tenantUnit.logging')}
        href={getHref(p => (p.pathname = '/internal/monitoringUnit/unit/logging'))}
      />
      <LinkListItem
        label={t('in-internal:monitoringUnit.unit.tenantUnit.entityStatistic')}
        href={getHref(p => (p.pathname = '/internal/monitoringUnit/unit/entityStatistics'))}
      />
      <LinkListItem
        label={t('in-internal:monitoringUnit.unit.tenantUnit.infrastructure')}
        href={getHref(p => (p.pathname = '/internal/monitoringUnit/unit/infrastructureDataStatistics'))}
      />
      <LinkListItem
        label={t('in-internal:monitoringUnit.unit.tenantUnit.profile')}
        href={getHref(p => (p.pathname = '/internal/monitoringUnit/unit/profileDataStatistics'))}
      />
      {canSeeExtendedInternalMonitoring && (
        <LinkListItem
          label={t('in-internal:monitoringUnit.unit.tenantUnit.sloViolations')}
          href={getHref(p => {
            p.pathname = '/events';
            p.query.q = `(event.text:"[SLO]" OR event.text:"[experimental SLO]") AND event.state:open entity.label:"${tenant}-${unit}-*"`;
          })}
        />
      )}
      <LinkListItem
        label={t('in-internal:monitoringUnit.unit.tenantUnit.stan')}
        href={getHref(p => (p.pathname = '/internal/monitoringUnit/unit/stan'))}
      />
    </LinkList>
  );
}
