/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';

import { getServiceLocators } from 'in-applications/FlowMap/serviceLocator/serviceLocator';
import { SIGNALS } from 'in-applications/FlowMap/components/Controls/Controls';
import getHeatMapColor, { neutralColorRgb } from 'in-services/heatMapColors';
import SceneObject from 'in-applications/FlowMap/sceneObjects/SceneObject';
import { alwaysNull } from 'in-services/fixedStreams';
import Subscriber from 'in-map/misc/Subscriber';

export default class NodeBase extends SceneObject {
  constructor(serviceLocatorUid, id) {
    super(id, serviceLocatorUid);

    this.subscriber = new Subscriber();
    this.outgoing = [];
    this.incoming = [];
  }

  initSubscriptions() {
    this.subscriber.addSubscription(
      getServiceLocators(this.serviceLocatorUid)
        .eventBusServiceLocator.on(SIGNALS.HEATMAP)
        .flatMap(heatMapMetric => {
          if (heatMapMetric) {
            return getServiceLocators(this.serviceLocatorUid)
              .eventBusServiceLocator.on('maxHeatMapMetricValue')
              .map(maxHeatMapMetricValue => {
                return maxHeatMapMetricValue
                  ? getHeatMapColor(this.getMetricValueOrDefault(heatMapMetric, 0) / maxHeatMapMetricValue)
                  : null;
              });
          } else {
            return alwaysNull;
          }
        })
        .subscribe(color => {
          this.heatMapColor = color;
          this.events$.emit('heatMapColor', color);
        })
    );
  }

  getHeatMapColor() {
    return this.heatMapColor || neutralColorRgb;
  }

  setMetrics(metrics) {
    if (metrics) {
      this.calls = get(metrics, ['callsAgg', 0, 1], null);
      this.errors = get(metrics, ['errorsAgg', 0, 1], null);
      this.latency = get(metrics, ['latencyAgg', 0, 1], null);
      this.events$.emit('metricValues', {
        calls: this.calls,
        errors: this.errors,
        latency: this.latency
      });
    }
  }

  getMetricValue(metric) {
    return this[metric];
  }

  getMetricValueOrDefault(metric, defaultValue) {
    return this.getMetricValue(metric) || defaultValue;
  }

  setConnected(items, direction) {
    this[direction] = items;
  }

  setData(data) {
    if (data) {
      this.events$.emit('data', data);
    }
  }

  setApplicationId(applicationId) {
    if (applicationId) {
      this.applicationId = applicationId;
    }
  }

  setIsExpanded(isExpanded, direction) {
    this.events$.emit(`isExpanded_${direction}`, isExpanded);
  }

  setIsLoadingData(isLoading, direction) {
    this.events$.emit(`isLoadingData_${direction}`, isLoading);
  }

  setErrors(errors = [], direction) {
    if (errors.length > 0) {
      this.resetConnected(direction);
    }
    this.events$.emit(`errors_${direction}`, errors);
  }

  resetConnected(direction) {
    this[direction] = [];
    this.setIsExpanded(false, direction);
  }

  dispose() {
    this.subscriber.dispose();
    this.subscriber = null;

    super.dispose();

    this.outgoing = null;
    this.incoming = null;
  }
}
