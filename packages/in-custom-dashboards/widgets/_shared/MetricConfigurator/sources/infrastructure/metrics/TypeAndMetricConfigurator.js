/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import { SvgIcon, Message, Spacer, Select } from '@instana/components';

import IndeterminateLoadingIndicator from 'in-components/LoadingIndicators/IndeterminateLoadingIndicator';
import DropdownButton from 'in-components/Button/DropdownButton';
import Overlay from 'in-components/overlays/Overlay';
import { allUnits } from 'in-stores/metric/units';
import { t } from 'in-i18n';

import locals from './TypeAndMetricConfigurator.mless';

export default function TypeAndMetricConfigurator({
  metricMetadata,
  SelectorOverlay,
  errors,
  selectMetric = t('in-custom-dashboards:widgets.srcInfrastructure.typeAndMetricConfigurator.pleaseSelectMetric'),
  withUnit = false,
  ...props
}) {
  if (errors?.length > 0) {
    return <Errors errors={errors} />;
  }

  return (
    <>
      <div className={withUnit ? locals.configuratorWithAdditionalContent : ''}>
        <Overlay content={SelectorOverlay} props={props} align="bottomLeft">
          {({ toggle, refSetter }) => (
            <DropdownButton
              kind="tertiary"
              size="compact"
              onClick={toggle}
              refSetter={refSetter}
              className={locals.carbonConfigurator}
            >
              <TypeAndMetricLabel selectMetric={selectMetric} {...metricMetadata} />
            </DropdownButton>
          )}
        </Overlay>
        {withUnit && (
          <div className={locals.metricUnitWrapper}>
            <Spacer horizontal="large" />
            {t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.unit')}
            <Spacer horizontal="small" />
            <Select
              id="metric-configurator-unit"
              value={props?.unitField?.value}
              onChange={e => props?.onUnitChange(e)}
              disabled={!!props?.preSelectedUnit}
            >
              <>
                {Object.values(allUnits).map(({ id: value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </>
            </Select>
          </div>
        )}
      </div>
    </>
  );
}

TypeAndMetricConfigurator.propTypes = {
  metricMetadata: rpt.object,
  metricCatalog: rpt.object,
  loading: rpt.bool,
  errors: rpt.array,
  onChange: rpt.func.isRequired,
  query: rpt.string.isRequired,
  onQueryChange: rpt.func.isRequired,
  selectMetric: rpt.string,
  SelectorOverlay: rpt.func,
  withUnit: rpt.bool,
  onUnitChange: rpt.func,
  preSelectedUnit: rpt.string,
  unitField: rpt.object
};

function Errors({ errors }) {
  return (
    <>
      {errors.map(error => (
        <Message key={error.code} type="error" small>
          {error.message}
        </Message>
      ))}
    </>
  );
}

function TypeAndMetricLabel({ selectMetric, path, label, loading, metric }) {
  if (loading) {
    return (
      <div className={locals.loadingWrapper}>
        <IndeterminateLoadingIndicator customStyle={{ strokeColor: 'currentColor' }} size={'xs'} />
        <span className={locals.loadingText}>
          {t('in-custom-dashboards:widgets.srcInfrastructure.typeAndMetricConfigurator.loadingMetrics')}
        </span>
      </div>
    );
  }
  if (!metric && !label && (!path || path.length == 0)) {
    return selectMetric;
  }
  return (
    <>
      {path
        .slice(1)
        .concat([label || metric])
        .reduce((acc, elem) => (
          <>
            {acc}
            <SvgIcon className={locals.icon} type="lib_arrow_drop_right" />
            {elem}
          </>
        ))}
    </>
  );
}
