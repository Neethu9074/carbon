/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { number, millis, percentage } from 'in-services/formatters/number';
import Button from 'in-components/MapControls/Button';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

import locals from './NodeSizeButton.mless';

export default function NodeSizeButton(props) {
  const { eventBusServiceLocator } = props;
  const activeSizeMetric = useObservable(eventBusServiceLocator.on(SIGNALS.SIZING_METRIC), []);
  const powerFunctions = useObservable(eventBusServiceLocator.on(SIGNALS.POWER_FUNCTIONS), []);

  return (
    <Overlay content={ContextMenu} props={props}>
      {({ toggle, isOpen }) => (
        <Button
          {...props}
          icon="lib_actions_map_node_size"
          onClick={toggle}
          renderContent={() => (
            <Fragment>
              {getLabel(activeSizeMetric, powerFunctions)}
              <SvgIcon className={locals.expandIcon} type={isOpen ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'} />
            </Fragment>
          )}
          appendLeft
        />
      )}
    </Overlay>
  );
}

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
