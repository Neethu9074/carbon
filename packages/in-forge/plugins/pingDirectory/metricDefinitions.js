/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';

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
    metrics: getDynamicMetricMatch('recent_changes.data', 'add_entry_count', 'Database'),
    labels: ['Number of added entries'],
    category: ['Recent Changes'],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('recent_changes.data', 'changed_entry_count', 'Database'),
    labels: ['Number of changed entries'],
    category: ['Recent Changes'],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('recent_changes.data', 'delete_entry_count', 'Database'),
    labels: ['Number of deleted entries'],
    category: ['Recent Changes'],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('recent_changes.data', 'modify_entry_count', 'Database'),
    labels: ['Number of modified entries'],
    category: ['Recent Changes'],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('recent_changes.data', 'rename_entry_count', 'Database'),
    labels: ['Number of renamed entries'],
    category: ['Recent Changes'],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('recent_changes.data', 'database_open_record_count', 'Database'),
    labels: ['Number of opened records'],
    category: ['Recent Changes'],
    min: 0,
    formatter: number
  },
  // ldap connection handlers
  {
    metrics: getDynamicMetricMatch('ldap_connectors.data', 'connection_count', 'LDAP Connector'),
    labels: ['Number of connections'],
    category: ['Active Connections'],
    min: 0,
    formatter: number
  },
  // ldap connection handler statistics
  {
    metrics: getDynamicMetricMatch('ldap_connector_statistics.data', 'add_requests', 'LDAP Connector'),
    labels: ['Number of add requests'],
    category: ['Connection Stats'],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('ldap_connector_statistics.data', 'bind_requests', 'LDAP Connector'),
    labels: ['Number of bind requests'],
    category: ['Connection Stats'],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('ldap_connector_statistics.data', 'compare_requests', 'LDAP Connector'),
    labels: ['Number of compare requests'],
    category: ['Connection Stats'],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('ldap_connector_statistics.data', 'delete_requests', 'LDAP Connector'),
    labels: ['Number of delete requests'],
    category: ['Connection Stats'],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('ldap_connector_statistics.data', 'extended_requests', 'LDAP Connector'),
    labels: ['Number of extended requests'],
    category: ['Connection Stats'],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('ldap_connector_statistics.data', 'modify_requests', 'LDAP Connector'),
    labels: ['Number of modify requests'],
    category: ['Connection Stats'],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('ldap_connector_statistics.data', 'search_requests', 'LDAP Connector'),
    labels: ['Number of search requests'],
    category: ['Connection Stats'],
    min: 0,
    formatter: number
  }
];
