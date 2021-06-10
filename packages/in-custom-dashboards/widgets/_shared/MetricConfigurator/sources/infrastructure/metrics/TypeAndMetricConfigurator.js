/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import MetricSelectorOverlay from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/MetricSelectorOverlay';
import DropdownButton from 'in-components/Button/DropdownButton';
import { emptyObject } from 'in-services/fixedObjects';
import Overlay from 'in-components/overlays/Overlay';
import Message from 'in-components/Message';
import { t } from 'in-i18n';

import locals from './TypeAndMetricConfigurator.mless';

export default function TypeAndMetricConfigurator({
  metricMetadata,
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
            <TypeAndMetricLabel selectMetric={selectMetric} metricMetadata={metricMetadata} />
          </DropdownButton>
        )}
      </Overlay>
    </>
  );
}

TypeAndMetricConfigurator.propTypes = {
  metricMetadata: rpt.object.isRequired,
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

function TypeAndMetricLabel({ selectMetric, metricMetadata }) {
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
