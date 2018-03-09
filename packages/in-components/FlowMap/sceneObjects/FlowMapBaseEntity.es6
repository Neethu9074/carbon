import getHeatMapColor, { DEFAULT_COLOR } from 'in-components/FlowMap/misc/heatMapColors';
import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import { SIGNALS } from 'in-components/FlowMap/components/Controls/Controls';
import SceneObject from 'in-components/FlowMap/sceneObjects/SceneObject';
import { alwaysNull } from 'in-services/fixedStreams';
import Subscriber from 'in-map/misc/Subscriber';
import { find } from 'in-services/arrayUtils';

export default class NodeBase extends SceneObject {
  constructor(serviceLocatorUid, id, metricValues) {
    super(id, serviceLocatorUid);

    this.subscriber = new Subscriber();
    this.outgoing = [];
    this.incoming = [];

    this.setMetrics(metricValues);
  }

  initSubscriptions(metricValues) {
    if (!metricValues) {
      this.subscriber.addSubscription(
        this.getMetrics(getServiceLocators(this.serviceLocatorUid).dataFetchingServiceLocator)
          .map(this.mapResult)
          .subscribe(this.setMetrics.bind(this))
      );
    }

    this.subscriber.addSubscription(
      getServiceLocators(this.serviceLocatorUid)
        .eventBusServiceLocator.on(SIGNALS.HEATMAP)
        .flatMap(heatMapMetric => {
          if (heatMapMetric) {
            return getServiceLocators(this.serviceLocatorUid)
              .eventBusServiceLocator.on('maxHeatMapMetricValue')
              .map(maxHeatMapMetricValue => {
                return maxHeatMapMetricValue
                  ? getHeatMapColor(heatMapMetric, this.getMetricValue(heatMapMetric) / maxHeatMapMetricValue)
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

  getMetricValue(metric) {
    return this[metric] || 0;
  }

  getHeatMapColor() {
    return this.heatMapColor || DEFAULT_COLOR;
  }

  mapResult(result) {
    const hasErrors = result.errors.length > 0;
    const isLoading = result.progress.loading;
    return hasErrors || isLoading ? null : result.data;
  }

  getMetrics(dataFetchingServiceLocator) {
    return dataFetchingServiceLocator.getMetrics$(this.id);
  }

  setMetrics(metrics) {
    if (metrics) {
      this.calls = metrics.callsAgg ? metrics.callsAgg[0][1] : 0;
      this.errors = metrics.errorsAgg ? metrics.errorsAgg[0][1] : 0;
      this.latency = metrics.latencyAgg ? metrics.latencyAgg[0][1] : 0;
      this.events$.emit('metricValues', {
        calls: this.calls,
        errors: this.errors,
        latency: this.latency
      });
    }
  }

  setData(data) {
    if (data) {
      this.events$.emit('data', data);
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
    this.setIsLoadingData(false, direction);
    this.events$.emit(`errors_${direction}`, errors);
  }

  addConnected(item, direction) {
    const contains = find(this[direction], _item => _item.id === item.id);
    if (!contains) {
      this[direction].push(item);
      this.setIsExpanded(true, direction);
    }
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
