import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import MetricConfiguratorOverlay from 'in-new-components/MetricConfigurator/MetricConfiguratorOverlay';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import { aggregationLabels } from 'in-stores/metric/metric';
import Overlay from 'in-new-components/overlays/Overlay';
import { compositeRef } from 'in-services/util/react';

export default function MetricConfigurator({ values, options, onChange }) {
  const ref = useRef();
  return (
    <Overlay
      content={MetricConfiguratorOverlay}
      props={{ options, onChange, values }}
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
          Select metrics
        </DropdownButton>
      )}
    </Overlay>
  );
}

MetricConfigurator.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      metricId: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.node,
      aggregations: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(aggregationLabels)).isRequired).isRequired
    }).isRequired
  ).isRequired,
  values: PropTypes.arrayOf(
    PropTypes.shape({
      metricId: PropTypes.string.isRequired,
      aggregation: PropTypes.oneOf(Object.keys(aggregationLabels)).isRequired
    })
  ).isRequired
};
