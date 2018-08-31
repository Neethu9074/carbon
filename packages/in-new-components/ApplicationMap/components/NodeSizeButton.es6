import React, { Fragment } from 'react';

import { SIGNALS } from 'in-new-components/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import Button from 'in-new-components/MapControls/Button';
import Overlay from 'in-new-components/overlays/Overlay';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './NodeSizeButton.mless';

export default connectTo(
  ({ eventBusServiceLocator }) => ({
    activeSizeMetric: eventBusServiceLocator.on(SIGNALS.SIZING_METRIC)
  }),
  function NodeSizeButton(props) {
    return (
      <Overlay content={ContextMenu} props={props}>
        {({ toggle, isOpen }) => (
          <Button
            onClick={toggle}
            icon="lib_actions_zoom_in"
            renderContent={() => (
              <Fragment>
                <span className={locals.sizeMetricLabel}>{getLabel(props.activeSizeMetric)}</span>
                <SvgIcon
                  className={locals.expandIcon}
                  type={isOpen ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
                  width={24}
                  height={24}
                />
              </Fragment>
            )}
          />
        )}
      </Overlay>
    );
  }
);

function getLabel(metric) {
  if (!metric) {
    return 'No sizing';
  }
  if (metric === 'calls') {
    return 'Calls';
  }
  if (metric === 'errorRate') {
    return 'Error Rate';
  }
  if (metric === 'latency') {
    return 'Latency';
  }
}

function ContextMenu({ onChangeUrlProperties, close }) {
  function Metric({ metric }) {
    return (
      <li
        className={locals.metric}
        onClick={() => {
          onChangeUrlProperties({ sizingMetric: metric });
          close();
        }}
      >
        {getLabel(metric)}
      </li>
    );
  }
  return (
    <ul className={locals.contextMenu}>
      <Metric metric="calls" />
      <Metric metric="errorRate" />
      <Metric metric="latency" />
      <Metric metric={null} />
    </ul>
  );
}
