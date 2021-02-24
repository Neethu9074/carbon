/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Route } from 'react-router-dom';
import { t } from 'in-i18n';
import React from 'react';

import InfrastructureDataStatistics from 'in-internal/monitoringUnit/unit/InfrastructureDataStatistics';
import ApplicationDataStatistics from 'in-internal/monitoringUnit/unit/ApplicationDataStatistics';
import ProfileDataStatistics from 'in-internal/monitoringUnit/unit/ProfileDataStatistics';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { LinkList, LinkListItem } from 'in-internal/components/LinkList/LinkList';
import EntityStatistics from 'in-internal/monitoringUnit/unit/EntityStatistics';
import UnitsBreadcrumb from 'in-internal/monitoringUnit/units/UnitsBreadcrumb';
import InternalViewWrapper from 'in-internal/components/InternalViewWrapper';
import { linkToTenantUnit } from 'in-internal/components/crossUnitLinks';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import Landing from 'in-internal/monitoringUnit/unit/Landing';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import Switch from 'in-components/FragmentSupportingSwitch';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Stan from 'in-internal/monitoringUnit/unit/Stan';
import Eum from 'in-internal/monitoringUnit/unit/Eum';
import { timeConfig$ } from 'in-stores/time/config';
import { isInstanaEmail } from 'in-stores/user';
import search from 'in-subscription/search';
import connectTo from 'in-hoc/connectTo';

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

  return (
    <InternalViewWrapper>
      <Breadcrumbs
        items={[
          <UnitsBreadcrumb />,
          <Breadcrumb
            href$={getModifiedUrlStream(params => {
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
              <Route
                path="/internal/monitoringUnit/unit/entityStatistics"
                render={() => (
                  <EntityStatistics timeConfig={timeConfig} tenantUnitId={tenantUnitId} tenant={tenant} unit={unit} />
                )}
              />
              <Route
                path="/internal/monitoringUnit/unit/applicationDataStatistics"
                render={() => (
                  <ApplicationDataStatistics
                    timeConfig={timeConfig}
                    tenantUnitId={tenantUnitId}
                    tenant={tenant}
                    unit={unit}
                  />
                )}
              />
              <Route
                path="/internal/monitoringUnit/unit/eum"
                render={() => <Eum timeConfig={timeConfig} tenantUnitId={tenantUnitId} tenant={tenant} unit={unit} />}
              />
              <Route
                path="/internal/monitoringUnit/unit/infrastructureDataStatistics"
                render={() => (
                  <InfrastructureDataStatistics
                    timeConfig={timeConfig}
                    tenantUnitId={tenantUnitId}
                    tenant={tenant}
                    unit={unit}
                  />
                )}
              />
              <Route
                path="/internal/monitoringUnit/unit/profileDataStatistics"
                render={() => (
                  <ProfileDataStatistics
                    timeConfig={timeConfig}
                    tenantUnitId={tenantUnitId}
                    tenant={tenant}
                    unit={unit}
                  />
                )}
              />
              <Route
                path="/internal/monitoringUnit/unit/stan"
                render={() => <Stan timeConfig={timeConfig} tenantUnitId={tenantUnitId} tenant={tenant} unit={unit} />}
              />
              <Route
                path="/internal/monitoringUnit/unit"
                render={() => (
                  <Landing timeConfig={timeConfig} tenantUnitId={tenantUnitId} tenant={tenant} unit={unit} />
                )}
              />
            </Switch>
          )}
        </div>
      </div>
    </InternalViewWrapper>
  );
});

function Navigation({ tenant, unit }) {
  return (
    <LinkList>
      <LinkListItem label={t('in-internal:monitoringUnit.unit.tenantUnit.home')} href$={getModifiedUrlStream(p => (p.pathname = '/internal/monitoringUnit/unit'))} />
      <LinkListItem
        label={t('in-internal:monitoringUnit.unit.tenantUnit.agents')}
        external
        href$={getModifiedUrlStream(params => (params.pathname = '/internal/thisUnit/agents')).map(href =>
          linkToTenantUnit(href, tenant, unit)
        )}
      />
      <LinkListItem
        label={t('in-internal:monitoringUnit.unit.tenantUnit.application')}
        href$={getModifiedUrlStream(p => (p.pathname = '/internal/monitoringUnit/unit/applicationDataStatistics'))}
      />
      <LinkListItem
        label={t('in-internal:monitoringUnit.unit.tenantUnit.endUserMonitor')}
        href$={getModifiedUrlStream(p => (p.pathname = '/internal/monitoringUnit/unit/eum'))}
      />
      <LinkListItem
        label={t('in-internal:monitoringUnit.unit.tenantUnit.entityStatistic')}
        href$={getModifiedUrlStream(p => (p.pathname = '/internal/monitoringUnit/unit/entityStatistics'))}
      />
      <LinkListItem
        label={t('in-internal:monitoringUnit.unit.tenantUnit.infrastructure')}
        href$={getModifiedUrlStream(p => (p.pathname = '/internal/monitoringUnit/unit/infrastructureDataStatistics'))}
      />
      <LinkListItem
        label={t('in-internal:monitoringUnit.unit.tenantUnit.profile')}
        href$={getModifiedUrlStream(p => (p.pathname = '/internal/monitoringUnit/unit/profileDataStatistics'))}
      />
      {isInstanaEmail && (
        <LinkListItem
          label={t('in-internal:monitoringUnit.unit.tenantUnit.sloViolations')}
          href$={getModifiedUrlStream(p => {
            p.pathname = '/events';
            p.query.q = `(event.text:"[SLO]" OR event.text:"[experimental SLO]") AND event.state:open entity.label:"${tenant}-${unit}-*"`;
          })}
        />
      )}
      <LinkListItem
        label={t('in-internal:monitoringUnit.unit.tenantUnit.stan')}
        href$={getModifiedUrlStream(p => (p.pathname = '/internal/monitoringUnit/unit/stan'))}
      />
    </LinkList>
  );
}
