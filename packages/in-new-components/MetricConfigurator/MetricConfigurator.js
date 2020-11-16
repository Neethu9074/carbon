import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import MetricConfiguratorOverlay from 'in-new-components/MetricConfigurator/MetricConfiguratorOverlay';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import { aggregationLabels } from 'in-stores/metric/metric';
import Overlay from 'in-new-components/overlays/Overlay';
import { compositeRef } from 'in-services/util/react';
import locals from './MetricConfigurator.mless';

export default function MetricConfigurator({ values, options, onChange, tracking }) {
  const ref = useRef();

  return (
    <Overlay
      content={MetricConfiguratorOverlay}
      props={{ options, values, onChange, tracking }}
      withoutWrapper
      onCloseSideEffect={() => ref.current?.focus()}
    >
      {({ toggle, refSetter }) => (
        <DropdownButton
          className={locals.select}
          kind="secondary"
          icon="lib_actions_settings"
          refSetter={compositeRef(refSetter, ref)}
          onClick={toggle}
        >
          Select metrics
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

MetricConfigurator.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      metric: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.node,
      aggregations: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(aggregationLabels)).isRequired).isRequired
    }).isRequired
  ).isRequired,
  values: PropTypes.arrayOf(
    PropTypes.shape({
      metric: PropTypes.string.isRequired,
      aggregation: PropTypes.oneOf(Object.keys(aggregationLabels)).isRequired
    })
  ).isRequired,
  tracking: PropTypes.shape(trackingProps)
};
