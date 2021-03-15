/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import MetricSelectorOverlay from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/MetricSelectorOverlay';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import Overlay from 'in-new-components/overlays/Overlay';
import Message from 'in-new-components/Message';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './TypeAndMetricConfigurator.mless';

export default function TypeAndMetricConfigurator({
  metric,
  type,
  metricCatalog,
  onChange,
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
          onChange
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
    return (
      <>
        {type} <SvgIcon className={locals.icon} type="lib_arrow_drop_right" /> {metric}
      </>
    );
  }
  return label;
}
