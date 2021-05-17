/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import MetricSelectorOverlay from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/MetricSelectorOverlay';
import getMetricMetadata from 'in-infrastructure/subscriptions/getMetricMetadata';
import useMetricMetadata from 'in-infrastructure/hooks/useMetricMetadata';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import Overlay from 'in-new-components/overlays/Overlay';
import { emptyObject } from 'in-services/fixedObjects';
import Message from 'in-new-components/Message';
import { t } from 'in-i18n';

import locals from './TypeAndMetricConfigurator.mless';

export default function TypeAndMetricConfigurator({
  metric,
  type,
  metricCatalog,
  onChange,
  query,
  onQueryChange,
  selectMetric = t('in-custom-dashboards:widgets.srcInfrastructure.typeAndMetricConfigurator.pleaseSelectMetric')
}) {
  if (metricCatalog?.errors.length > 0) {
    return <Errors errors={metricCatalog?.errors} />;
  }

  return (
    <>
      <Overlay
        content={MetricSelectorOverlay}
        props={{
          metricCatalog: metricCatalog.data,
          loading: metricCatalog.progress.loading,
          onChange,
          query,
          onQueryChange
        }}
        align={'bottomLeft'}
        withoutWrapper
      >
        {({ toggle, refSetter }) => (
          <DropdownButton
            kind="secondary"
            size="compact"
            onClick={toggle}
            refSetter={refSetter}
            className={locals.configurator}
          >
            <TypeAndMetricLabel type={type} metric={metric} selectMetric={selectMetric} />
          </DropdownButton>
        )}
      </Overlay>
    </>
  );
}

TypeAndMetricConfigurator.propTypes = {
  metric: rpt.string,
  type: rpt.string,
  metricCatalog: rpt.object.isRequired,
  onChange: rpt.func.isRequired,
  query: rpt.string.isRequired,
  onQueryChange: rpt.func.isRequired,
  selectMetric: rpt.string
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

function TypeAndMetricLabel({ type, metric, selectMetric }) {
  const metricMetadata = useMetricMetadata({ getMetricMetadata, type, metric });
  if (metricMetadata?.progress?.loading) {
    return null;
  }
  if (metricMetadata === emptyObject) {
    return selectMetric;
  }
  return (
    <>
      {metricMetadata.ownerType}
      {metricMetadata.category && (
        <>
          <SvgIcon className={locals.icon} type="lib_arrow_drop_right" />
          {metricMetadata.category}
        </>
      )}
      <SvgIcon className={locals.icon} type="lib_arrow_drop_right" />
      {metricMetadata.label}
    </>
  );
}
