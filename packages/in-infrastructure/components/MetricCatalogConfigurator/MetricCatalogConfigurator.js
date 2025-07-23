/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import MetricCatalogConfiguratorOverlay from 'in-infrastructure/components/MetricCatalogConfigurator/MetricCatalogConfiguratorOverlay';
import DropdownButton from 'in-components/Button/DropdownButton';
import { aggregationLabels } from 'in-stores/metric/metric';
import { compositeRef } from 'in-services/util/react';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

export default function MetricCatalogConfigurator({
  values,
  onChange,
  tracking,
  MetricCatalogConfiguratorHint,
  query,
  onQueryChange,
  metricCatalog,
  type,
  metricMetadatas,
  crossSeriesSumEnabled
}) {
  const ref = useRef();

  return (
    <Overlay
      content={MetricCatalogConfiguratorOverlay}
      props={{
        values,
        onChange,
        tracking,
        MetricCatalogConfiguratorHint,
        query,
        onQueryChange,
        metricCatalog,
        type,
        metricMetadatas,
        crossSeriesSumEnabled
      }}
      withoutWrapper
      onCloseSideEffect={() => ref.current?.focus()}
    >
      {({ toggle, refSetter }) => (
        <DropdownButton
          kind="secondary"
          icon="lib_actions_settings"
          refSetter={compositeRef(refSetter, ref)}
          onClick={toggle}
        >
          {t('in-components:metricConfigurator.buttonSelectMetrics')}
        </DropdownButton>
      )}
    </Overlay>
  );
}

export const trackingProps = {
  onMetricAdded: PropTypes.func,
  onMetricRemoved: PropTypes.func,
  onMetricAggregationChanged: PropTypes.func
};

MetricCatalogConfigurator.propTypes = {
  onChange: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(
    PropTypes.shape({
      metric: PropTypes.string.isRequired,
      aggregation: PropTypes.oneOf(Object.keys(aggregationLabels)).isRequired,
      crossSeriesAggregation: PropTypes.oneOf(Object.keys(aggregationLabels))
    })
  ).isRequired,
  tracking: PropTypes.shape(trackingProps),
  MetricCatalogConfiguratorHint: PropTypes.func,
  type: PropTypes.string,
  query: PropTypes.string,
  onQueryChange: PropTypes.func,
  metricCatalog: PropTypes.any,
  metricMetadatas: PropTypes.object
};
