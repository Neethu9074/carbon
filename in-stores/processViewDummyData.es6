import {create} from 'reactive-observables';
import Immutable from 'immutable';


const processView$ = create()
  .emit(Immutable.fromJS([
    edge('customer-app', 'customer-schema', 'to'),
    edge('tracking-app', 'customer-app', 'to'),
    edge('shipping-app', 'customer-app', 'to'),
    edge('tomcat-1', 'tracking-app', 'of'),
    edge('tomcat-2', 'tracking-app', 'of'),
    edge('tomcat-2', 'shipping-app', 'of'),
    edge('tomcat-2', 'mysql-2', 'to'),
    edge('shipping-app', 'shipping-schema', 'to'),
    edge('mysql-1', 'customer-schema', 'of'),
    edge('mysql-2', 'customer-schema', 'of'),
    edge('mysql-2', 'shipping-schema', 'of')
  ]))
  .freeze();


function edge(from, to, rel) {
  return {
    from: 'process-view__' + from,
    to: 'process-view__' + to,
    relation: rel,
    type: 'add',
    id: 'process-view-connection:' + from + ',' + to + ',' + rel
  };
}


export function getProcessViewStructureObservable() {
  return processView$;
}


export function getDummySnapshot(snapshotId) {
  return create()
    .emit(Immutable.fromJS({
      from: 0,
      to: null,
      id: snapshotId,
      plugin: getPlugin(snapshotId),
      entityId: {
        host: 'abc',
        pluginId: 'def',
        steadyId: 'ghi'
      },
      processorTags: [],
      data: {
        label: getLabel(snapshotId)
      }
    }))
    .freeze();
}


function getPlugin(snapshotId) {
  if (snapshotId.indexOf('connection') !== -1) {
    return 'dummyConnection';
  } else if (snapshotId.indexOf('app') !== -1) {
    return 'dummyJavaApp';
  } else if (snapshotId.indexOf('schema') !== -1) {
    return 'dummyMysqlSchema';
  } else if (snapshotId.indexOf('mysql') !== -1) {
    return 'dummyMysqlDb';
  } else if (snapshotId.indexOf('tomcat') !== -1) {
    return 'dummyTomcat';
  }

  throw new Error(`Could not identify plugin for snapshot id ${snapshotId}`);
}

function getLabel(snapshotId) {
  return snapshotId.replace('process-view__', '').replace(/-/g, ' ');
}


export function getDummyMetric(metric) {
  let generateMetric = () => (Math.random() * 100) | 0;
  if (metric === 'errors') {
    generateMetric = () => Math.random() / 5;
  } else if (metric === 'sessions') {
    generateMetric = () => 500 * Math.random() | 0;
  }

  let intervalHandle;
  return create({
    start(observable) {
      intervalHandle = setInterval(() => {
        observable.emit([Date.now(), generateMetric()]);
      }, 1000);
    },

    stop() {
      clearInterval(intervalHandle);
    }
  });
}

export function getDummyHistoricMetrics(metric, timeframe) {
  let generateMetric = () => (Math.random() * 100) | 0;
  if (metric === 'errors') {
    generateMetric = () => Math.random() / 5;
  } else if (metric === 'sessions') {
    generateMetric = () => 500 * Math.random() | 0;
  }

  const from = Date.now() - timeframe.windowSize;
  const numMetrics = 10;
  const metrics = [];

  for (let i = 0; i < numMetrics; i++) {
    const array = [from + (timeframe.windowSize * (i / numMetrics)), generateMetric()];
    array.time = array[0];
    metrics.push(array);
  }

  return create()
         .emit(metrics)
         .freeze();
}
