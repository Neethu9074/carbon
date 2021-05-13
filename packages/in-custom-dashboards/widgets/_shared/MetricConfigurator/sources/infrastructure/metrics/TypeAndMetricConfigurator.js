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
  label = t('in-custom-dashboards:widgets.srcInfrastructure.typeAndMetricConfigurator.pleaseSelectMetric')
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
            <TypeAndMetricLabel type={type} metric={metric} label={label} />
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
  label: rpt.string
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

function TypeAndMetricLabel({ type, metric, label }) {
  if (type && metric) {
    const metricMetadata = useMetricMetadata({ getMetricMetadata, type, metric });
    const elements = [metricMetadata.ownerType, metricMetadata.category, metricMetadata.label].filter(Boolean);
    return elements.reduce(
      (prev, current) =>
        prev == null ? current : [prev, <SvgIcon className={locals.icon} type="lib_arrow_drop_right" />, current],
      null
    );
  }
  return label;
}
