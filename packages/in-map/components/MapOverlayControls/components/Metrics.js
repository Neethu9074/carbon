/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable react/no-multi-comp */
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { fromJS } from 'immutable';
import { isEqual } from 'lodash';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

import { setActiveMetric, clearActiveMetric, activeMetric$ } from 'in-stores/metric';
import Control from 'in-map/components/MapOverlayControls/components/Control';
import { track, MAP_METRICS_SHOW } from 'in-services/tracking/tracking';
import { types, view$ } from 'in-infrastructure/perspectives';
import { t } from 'in-i18n';

import 'in-map/components/MapOverlayControls/components/Metrics.less';

const block = 'in-controls-metrics';

export default function Metrics() {
  const activeMetric = useObservable(() => activeMetric$, []);

  useEffect(() => {
    return () => {
      if (activeMetric) {
        clearActiveMetric();
      }
    };
  }, [activeMetric]);

  return (
    <Control
      createMenuContent={createMenuContent}
      isActive={!!activeMetric}
      tooltipText={t('in-map:showMetrics')}
      type="lib_datetime_speed"
    />
  );
}

Metrics.displayName = 'Metrics';

function createMenuContent() {
  return <MetricPanel />;
}

function MetricPanel() {
  const [isOpen, setIsOpen] = useState(true);

  const view = useObservable(() => view$, []);

  const metricList = getMetricList(view);

  return (
    <div className={block}>
      {isOpen ? (
        <div className={`${block}__wrapper`}>
          {Object.keys(metricList).map(topic => (
            <Topic key={topic} label={topic} list={metricList} />
          ))}
        </div>
      ) : null}

      <DropDown onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
    </div>
  );
}

MetricPanel.displayName = 'MetricPanel';

const DropDown = ({ onClick, isOpen }) => {
  const activeMetric = useObservable(() => activeMetric$, []);

  return (
    <div className={`${block}__dropdown`}>
      <div className={`${block}__dropdown-label`} onClick={onClick}>
        {activeMetric ? activeMetric.get('longLabel') : t('in-map:chooseMetric')}

        <SvgIcon
          className={`${block}__icon`}
          type={isOpen ? 'lib_arrow_drop_down' : 'lib_arrow_drop_up'}
          size="s"
          color={'#7b8e96'}
        />
      </div>

      <ResetButton />
    </div>
  );
};

const ResetButton = () => {
  const activeMetric = useObservable(() => activeMetric$, []);

  if (!activeMetric) {
    return null;
  }

  return (
    <div className={`${block}__reset`} onClick={clearActiveMetric}>
      {t('in-map:reset')}
    </div>
  );
};

function Topic({ label, list }) {
  const topic = list[label];
  return (
    <div>
      <h4 className={`${block}__topic`}>{t('in-map:metrics', { context: label })}</h4>
      <ul className={`${block}__list`}>
        {Object.keys(topic).map(metricKey => (
          <Metric key={metricKey} topic={label} metricKey={metricKey} metric={topic} />
        ))}
      </ul>
    </div>
  );
}

let lastMetricSelection = { topic: null, metricKey: null };
const Metric = ({ metricKey, metric, topic }) => {
  const activeMetric = useObservable(() => activeMetric$, []);

  const handleClick = () => {
    const newMetricSelection = { topic, metricKey };
    if (!isEqual(lastMetricSelection, newMetricSelection)) {
      track(MAP_METRICS_SHOW);
    }
    lastMetricSelection = newMetricSelection;
    setActiveMetric(
      fromJS({
        name: metricKey,
        longLabel: `${topic} ${metricKey}`,
        metrics: metric[metricKey]
      })
    );
  };

  return (
    <div
      className={classNames({
        [`${block}__metric`]: true,
        [`${block}__metric--active`]: activeMetric && activeMetric.get('name') === metricKey
      })}
      onClick={handleClick}
    >
      {t('in-map:metrics', { context: metricKey })}
    </div>
  );
};

function getMetricList(view) {
  if (view === types.container) {
    return {
      CPU: {
        TotalUsage: [
          {
            name: 'cpu.total_usage',
            label: t('in-map:totalCpuUsage'),
            timeWindowAggregation: 'mean'
          }
        ]
      },
      Memory: {
        Usage: [{ name: 'memory.usage', label: t('in-map:memoryUsage'), timeWindowAggregation: 'mean' }]
      }
    };
  }
  return {
    CPU: {
      Load: [{ name: 'load.1min', label: t('in-map:load'), timeWindowAggregation: 'mean' }],
      Usage: [
        { name: 'cpu.user', label: t('in-map:user'), timeWindowAggregation: 'mean' },
        { name: 'cpu.sys', label: t('in-map:system'), timeWindowAggregation: 'mean' },
        { name: 'cpu.wait', label: t('in-map:wait'), timeWindowAggregation: 'mean' },
        { name: 'cpu.nice', label: t('in-map:nice'), timeWindowAggregation: 'mean' },
        { name: 'cpu.steal', label: t('in-map:steal'), timeWindowAggregation: 'mean' }
      ]
    },
    Memory: {
      Used: [{ name: 'memory.used', label: t('in-map:memoryUsed'), timeWindowAggregation: 'mean' }]
    }
  };
}
