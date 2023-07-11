/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { useObservable } from '@instana/hooks';

import { analysisTypes } from 'in-internal/monitoringUnit/units/UnitList/analysisModes';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import UnitsBreadcrumb from 'in-internal/monitoringUnit/units/UnitsBreadcrumb';
import InternalViewWrapper from 'in-internal/components/InternalViewWrapper';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getSnapshots } from 'in-stores/snapshot';
import Select from 'in-components/form/Select';
import useUrlState from 'in-hooks/useUrlState';
import search from 'in-subscription/search';
import { t } from 'in-i18n';

import locals from './UnitList.mless';

export default function UnitList() {
  const timeConfig = useTimeConfig();
  const units = useObservable(
    () =>
      search({
        query: 'entity.selfType:tenantUnit',
        view: 'TABLE',
        timeConfig
      })
        .flatMap(getSnapshots)
        .map(snapshots =>
          snapshots.map(snapshot => ({
            id: snapshot.get('id'),
            tenant: snapshot.getIn(['data', 'tenant']),
            unit: snapshot.getIn(['data', 'unit'])
          }))
        ),
    [timeConfig]
  );
  const [urlState, setUrlState] = useUrlState({
    bind: [
      {
        path: '/units',
        name: 'analysisType',
        initialState: ''
      },
      {
        path: '/units',
        name: 'metricAggregation',
        initialState: 'mean'
      }
    ]
  });
  const { analysisType, metricAggregation } = urlState;
  const { cols, initialSortColumn, initialSortDirection, getRowDetails } =
    analysisTypes[analysisType] || analysisTypes[''];

  return (
    <InternalViewWrapper>
      <Breadcrumbs items={[<UnitsBreadcrumb />]} />

      {!units && <LoadingIndicator />}

      {units && (
        <Table
          key={`${analysisType}-${metricAggregation}`}
          cardTitle={t('in-internal:monitoringUnit.units.unitList.units')}
          withoutPadding
          cols={cols}
          rows={units.map(({ id, tenant, unit }) => ({
            key: id,
            id,
            tenant,
            unit,
            timeConfig,
            metricAggregation
          }))}
          maxItemsPerPage={50}
          initialSortColumn={initialSortColumn}
          initialSortDirection={initialSortDirection}
          getRowDetails={getRowDetails}
          rightHeader={
            <Fragment>
              {t('in-internal:monitoringUnit.units.unitList.analyze')}
              <Select
                value={analysisType}
                onChange={e => setUrlState({ analysisType: e.target.value })}
                className={locals.modeSwitch}
              >
                {Object.keys(analysisTypes)
                  .sort()
                  .map(key => (
                    <option key={key} value={key}>
                      {analysisTypes[key].name}
                    </option>
                  ))}
              </Select>
              {t('in-internal:monitoringUnit.units.unitList.metricAggreg')}
              <Select
                value={metricAggregation}
                onChange={e => setUrlState({ metricAggregation: e.target.value })}
                className={locals.aggregationSwitch}
              >
                <option value="mean">{t('in-internal:monitoringUnit.units.unitList.mean')}</option>
                <option value="max">{t('in-internal:monitoringUnit.units.unitList.max')}</option>
                <option value="sum">{t('in-internal:monitoringUnit.units.unitList.sum')}</option>
              </Select>
            </Fragment>
          }
        />
      )}
    </InternalViewWrapper>
  );
}
