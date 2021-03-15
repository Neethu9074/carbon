/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['operations_in_progress', 'searches_in_progress'],
    labels: [t('in-forge:plugins.pingDirectory.operations'), t('in-forge:plugins.pingDirectory.searches')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['established_connections', 'max_concurrent_connections', 'total_connections_since_startup'],
    labels: [
      t('in-forge:plugins.pingDirectory.establishedConnections'),
      t('in-forge:plugins.pingDirectory.maxConcurrentConnections'),
      t('in-forge:plugins.pingDirectory.totalConnections')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['available_file_descriptors', 'open_file_descriptors', 'max_file_descriptors'],
    labels: [
      t('in-forge:plugins.pingDirectory.availableDescriptors'),
      t('in-forge:plugins.pingDirectory.openDescriptors'),
      t('in-forge:plugins.pingDirectory.maxDescriptors')
    ],
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
      t('in-forge:plugins.pingDirectory.allFailedOperations'),
      t('in-forge:plugins.pingDirectory.addOpFailed'),
      t('in-forge:plugins.pingDirectory.bindOpFailed'),
      t('in-forge:plugins.pingDirectory.compareOpFailed'),
      t('in-forge:plugins.pingDirectory.deleteOpFailed'),
      t('in-forge:plugins.pingDirectory.extendedOpFailed'),
      t('in-forge:plugins.pingDirectory.modifyOpFailed'),
      t('in-forge:plugins.pingDirectory.searchOpFailed')
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
      t('in-forge:plugins.pingDirectory.allOperations'),
      t('in-forge:plugins.pingDirectory.addOpTotal'),
      t('in-forge:plugins.pingDirectory.bindOpTotal'),
      t('in-forge:plugins.pingDirectory.compareOpTotal'),
      t('in-forge:plugins.pingDirectory.deleteOpTotal'),
      t('in-forge:plugins.pingDirectory.extendedOpTotal'),
      t('in-forge:plugins.pingDirectory.modifyOpTotal'),
      t('in-forge:plugins.pingDirectory.searchOpTotal')
    ],
    min: 0,
    formatter: number
  },
  // recent changes
  {
    metrics: getDynamicMetricMatch('recent_changes.data', 'add_entry_count', 'Database'),
    labels: [t('in-forge:plugins.pingDirectory.numberOfAddedEntries')],
    category: [t('in-forge:plugins.pingDirectory.recentChanges')],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('recent_changes.data', 'changed_entry_count', 'Database'),
    labels: [t('in-forge:plugins.pingDirectory.numberOfChangedEntries')],
    category: [t('in-forge:plugins.pingDirectory.recentChanges')],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('recent_changes.data', 'delete_entry_count', 'Database'),
    labels: [t('in-forge:plugins.pingDirectory.numberOfDeletedEntries')],
    category: [t('in-forge:plugins.pingDirectory.recentChanges')],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('recent_changes.data', 'modify_entry_count', 'Database'),
    labels: [t('in-forge:plugins.pingDirectory.numberOfModifiedEntries')],
    category: [t('in-forge:plugins.pingDirectory.recentChanges')],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('recent_changes.data', 'rename_entry_count', 'Database'),
    labels: [t('in-forge:plugins.pingDirectory.numberOfRenamedEntries')],
    category: [t('in-forge:plugins.pingDirectory.recentChanges')],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('recent_changes.data', 'database_open_record_count', 'Database'),
    labels: [t('in-forge:plugins.pingDirectory.numberOfOpenedRecords')],
    category: [t('in-forge:plugins.pingDirectory.recentChanges')],
    min: 0,
    formatter: number
  },
  // ldap connection handlers
  {
    metrics: getDynamicMetricMatch('ldap_connectors.data', 'connection_count', 'LDAP Connector'),
    labels: [t('in-forge:plugins.pingDirectory.numberOfConnections')],
    category: [t('in-forge:plugins.pingDirectory.activeConnections')],
    min: 0,
    formatter: number
  },
  // ldap connection handler statistics
  {
    metrics: getDynamicMetricMatch('ldap_connector_statistics.data', 'add_requests', 'LDAP Connector'),
    labels: [t('in-forge:plugins.pingDirectory.numberOfAddRequests')],
    category: [t('in-forge:plugins.pingDirectory.connectionStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('ldap_connector_statistics.data', 'bind_requests', 'LDAP Connector'),
    labels: [t('in-forge:plugins.pingDirectory.numberOfBindRequests')],
    category: [t('in-forge:plugins.pingDirectory.connectionStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('ldap_connector_statistics.data', 'compare_requests', 'LDAP Connector'),
    labels: [t('in-forge:plugins.pingDirectory.numberOfCompareRequests')],
    category: [t('in-forge:plugins.pingDirectory.connectionStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('ldap_connector_statistics.data', 'delete_requests', 'LDAP Connector'),
    labels: [t('in-forge:plugins.pingDirectory.numberOfDeleteRequests')],
    category: [t('in-forge:plugins.pingDirectory.connectionStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('ldap_connector_statistics.data', 'extended_requests', 'LDAP Connector'),
    labels: [t('in-forge:plugins.pingDirectory.numberOfExtendedRequests')],
    category: [t('in-forge:plugins.pingDirectory.connectionStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('ldap_connector_statistics.data', 'modify_requests', 'LDAP Connector'),
    labels: [t('in-forge:plugins.pingDirectory.numberOfModifyRequests')],
    category: [t('in-forge:plugins.pingDirectory.connectionStats')],
    min: 0,
    formatter: number
  },
  {
    metrics: getDynamicMetricMatch('ldap_connector_statistics.data', 'search_requests', 'LDAP Connector'),
    labels: [t('in-forge:plugins.pingDirectory.numberOfSearchRequests')],
    category: [t('in-forge:plugins.pingDirectory.connectionStats')],
    min: 0,
    formatter: number
  }
];
