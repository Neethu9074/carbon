/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { SvgIcon } from '@instana/components';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { number, millis, percentage } from 'in-services/formatters/number';
import Button from 'in-new-components/MapControls/Button';
import Overlay from 'in-new-components/overlays/Overlay';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './NodeSizeButton.mless';

export default connectTo(
  ({ eventBusServiceLocator }) => ({
    activeSizeMetric: eventBusServiceLocator.on(SIGNALS.SIZING_METRIC),
    powerFunctions: eventBusServiceLocator.on(SIGNALS.POWER_FUNCTIONS)
  }),
  function NodeSizeButton(props) {
    return (
      <Overlay content={ContextMenu} props={props}>
        {({ toggle, isOpen }) => (
          <Button
            icon="lib_actions_map_node_size"
            onClick={toggle}
            renderContent={() => (
              <Fragment>
                {getLabel(props.activeSizeMetric, props.powerFunctions)}
                <SvgIcon
                  className={locals.expandIcon}
                  type={isOpen ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
                />
              </Fragment>
            )}
          />
        )}
      </Overlay>
    );
  }
);

function getLabel(metric, powerFunctions) {
  if (!metric) {
    return <span className={locals.sizeMetricLabel}>{t('in-applications:analyze.none')}</span>;
  }
  const min = powerFunctions ? powerFunctions.getMinMetricValueByName(metric) : null;
  const max = powerFunctions ? powerFunctions.getMaxMetricValueByName(metric) : null;
  if (metric === 'calls') {
    return <RangeLabel metric={t('in-applications:labelCalls')} min={min} max={max} formatter={number.compact} />;
  }
  if (metric === 'errorRate') {
    return (
      <RangeLabel metric={t('in-applications:labelErrorRate')} min={min} max={max} formatter={percentage.compact} />
    );
  }
  if (metric === 'latency') {
    return <RangeLabel metric={t('in-applications:labelLatency')} min={min} max={max} formatter={millis.detailed} />;
  }
}

function RangeLabel({ metric, min, max, formatter }) {
  return (
    <div className={locals.labelWrapper}>
      <span className={locals.sizeMetricLabel}>{metric} (</span>
      <span className={locals.sizeMetricLabel}>{formatter(min)}</span>
      <span className={locals.sizeMetricLabelSeperator}>–</span>
      <span className={locals.sizeMetricLabel}>{formatter(max)})</span>
    </div>
  );
}

function getLabelShort(metric) {
  if (!metric) {
    return t('in-applications:labelDisableSizing');
  }
  if (metric === 'calls') {
    return t('in-applications:labelIncomingCalling');
  }
  if (metric === 'errorRate') {
    return t('in-applications:labelMaxErroneousCallRate');
  }
  if (metric === 'latency') {
    return t('in-applications:labelMaxLatency');
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
        {getLabelShort(metric)}
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
