import { number } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: ['operations_in_progress', 'searches_in_progress'],
    labels: ['Operations', 'Searches'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['established_connections', 'max_concurrent_connections', 'total_connections_since_startup'],
    labels: ['Established connections', 'Max concurrent connections', 'Total connections'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['available_file_descriptors', 'open_file_descriptors', 'max_file_descriptors'],
    labels: ['Available descriptors', 'Open descriptors', 'Max descriptors'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'all_ops_failed',
      'add_op_failed',
      'bind_op_failed',
      'compare_op_failed',
      'delete_op_failed',
      'extended_op_failed',
      'modify_op_failed',
      'search_op_failed'
    ],
    labels: [
      'All failed operations',
      'Add op failed',
      'Bind op failed',
      'Compare op failed',
      'Delete op failed',
      'Extended op failed',
      'Modify op failed',
      'Search op failed'
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'all_ops_total',
      'add_op_total',
      'bind_op_total',
      'compare_op_total',
      'delete_op_total',
      'extended_op_total',
      'modify_op_total',
      'search_op_total'
    ],
    labels: [
      'All operations',
      'Add op total',
      'Bind op total',
      'Compare op total',
      'Delete op total',
      'Extended op total',
      'Modify op total',
      'Search op total'
    ],
    min: 0,
    formatter: number
  },
  // recent changes
  {
    metrics: getMetricMatch('recent_changes.data', 'add_entry_count'),
    labels: ['Number of added entries'],
    min: 0,
    formatter: number
  },
  {
    metrics: getMetricMatch('recent_changes.data', 'changed_entry_count'),
    labels: ['Number of changed entries'],
    min: 0,
    formatter: number
  },
  {
    metrics: getMetricMatch('recent_changes.data', 'delete_entry_count'),
    labels: ['Number of deleted entries'],
    min: 0,
    formatter: number
  },
  {
    metrics: getMetricMatch('recent_changes.data', 'modify_entry_count'),
    labels: ['Number of modified entries'],
    min: 0,
    formatter: number
  },
  {
    metrics: getMetricMatch('recent_changes.data', 'rename_entry_count'),
    labels: ['Number of renamed entries'],
    min: 0,
    formatter: number
  },
  {
    metrics: getMetricMatch('recent_changes.data', 'database_open_record_count'),
    labels: ['Number of opened records'],
    min: 0,
    formatter: number
  },
  // ldap connection handlers
  {
    metrics: getMetricMatch('ldap_connectors.data', 'connection_count'),
    labels: ['Number of connections'],
    min: 0,
    formatter: number
  },
  // ldap connection handler statistics
  {
    metrics: getMetricMatch('ldap_connector_statistics.data', 'add_requests'),
    labels: ['Number of add requests'],
    min: 0,
    formatter: number
  },
  {
    metrics: getMetricMatch('ldap_connector_statistics.data', 'bind_requests'),
    labels: ['Number of bind requests'],
    min: 0,
    formatter: number
  },
  {
    metrics: getMetricMatch('ldap_connector_statistics.data', 'compare_requests'),
    labels: ['Number of compare requests'],
    min: 0,
    formatter: number
  },
  {
    metrics: getMetricMatch('ldap_connector_statistics.data', 'delete_requests'),
    labels: ['Number of delete requests'],
    min: 0,
    formatter: number
  },
  {
    metrics: getMetricMatch('ldap_connector_statistics.data', 'extended_requests'),
    labels: ['Number of extended requests'],
    min: 0,
    formatter: number
  },
  {
    metrics: getMetricMatch('ldap_connector_statistics.data', 'modify_requests'),
    labels: ['Number of modify requests'],
    min: 0,
    formatter: number
  },
  {
    metrics: getMetricMatch('ldap_connector_statistics.data', 'search_requests'),
    labels: ['Number of search requests'],
    min: 0,
    formatter: number
  }
];
