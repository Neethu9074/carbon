import { number, bytes } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metric: getMetricMatch('worker_pool', 'accepted_conn'),
    label: 'Accepted Connections',
    min: 0,
    formatter: number,
    isAvailable(snapshot) {
      // TODO: get pool name instead of foo
      return isStatusPathEnabled(snapshot, 'foo');
    }
  },
  {
    metric: getMetricMatch('worker_pool', 'slow_requests'),
    label: 'Slow Requests',
    min: 0,
    formatter: number,
    isAvailable(snapshot) {
      // TODO: get pool name instead of foo
      return isStatusPathEnabled(snapshot, 'foo');
    }
  },
  {
    metric: getMetricMatch('worker_pool', 'listen_queue'),
    label: 'Listen Queue',
    min: 0,
    formatter: number,
    isAvailable(snapshot) {
      // TODO: get pool name instead of foo
      return isStatusPathEnabled(snapshot, 'foo');
    }
  },
  {
    metric: getMetricMatch('worker_pool', 'max_listen_queue'),
    label: 'Max',
    min: 0,
    formatter: number,
    isAvailable(snapshot) {
      // TODO: get pool name instead of foo
      return isStatusPathEnabled(snapshot, 'foo');
    }
  },
  {
    metric: getMetricMatch('worker_pool', 'listen_queue_len'),
    label: 'Length',
    min: 0,
    formatter: number,
    isAvailable(snapshot) {
      // TODO: get pool name instead of foo
      return isStatusPathEnabled(snapshot, 'foo');
    }
  },
  {
    metric: getMetricMatch('worker_pool', 'idle_processes'),
    label: 'Idle',
    min: 0,
    formatter: number,
    isAvailable(snapshot) {
      // TODO: get pool name instead of foo
      return isStatusPathEnabled(snapshot, 'foo');
    }
  },
  {
    metric: getMetricMatch('worker_pool', 'active_processes'),
    label: 'Active',
    min: 0,
    formatter: number,
    isAvailable(snapshot) {
      // TODO: get pool name instead of foo
      return isStatusPathEnabled(snapshot, 'foo');
    }
  },
  {
    metric: getMetricMatch('worker_pool', 'total_processes'),
    label: 'Total',
    min: 0,
    formatter: number,
    isAvailable(snapshot) {
      // TODO: get pool name instead of foo
      return isStatusPathEnabled(snapshot, 'foo');
    }
  },
  {
    metric: getMetricMatch('worker_pool', 'max_active_processes'),
    label: 'Max Active',
    min: 0,
    formatter: number,
    isAvailable(snapshot) {
      // TODO: get pool name instead of foo
      return isStatusPathEnabled(snapshot, 'foo');
    }
  },
  {
    metric: getMetricMatch('worker_pool', 'max_children_reached'),
    label: 'Max Children',
    min: 0,
    formatter: number,
    isAvailable(snapshot) {
      // TODO: get pool name instead of foo
      return isStatusPathEnabled(snapshot, 'foo');
    }
  },
  {
    metric: getMetricMatch('worker_pool', 'total_memory'),
    label: 'Memory',
    min: 0,
    formatter: bytes,
    isAvailable(snapshot) {
      // TODO: get pool name instead of foo
      return isStatusPathEnabled(snapshot, 'foo');
    }
  }
];

function isStatusPathEnabled(snapshot, pool) {
  return snapshot.getIn(['data', 'worker_pool.' + pool + '.pm_status_path'], 'undefined') !== 'undefined';
}
