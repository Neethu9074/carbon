/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['milvus.status'],
    labels: [t('in-forge:plugins.oTelMilvusDB.milvus_status')],
    category: [t('in-forge:plugins.oTelMilvusDB.label_category_milvus')],
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('db.milvus.usage.insert_units', 'value', t('in-forge:plugins.oTelMilvusDB.service'))
    ],
    labels: [t('in-forge:plugins.oTelMilvusDB.dashboard.insert_units')],
    category: [t('in-forge:plugins.oTelMilvusDB.label_category_milvus')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('db.milvus.usage.upsert_units', 'value', t('in-forge:plugins.oTelMilvusDB.service'))
    ],
    labels: [t('in-forge:plugins.oTelMilvusDB.dashboard.upsert_units')],
    category: [t('in-forge:plugins.oTelMilvusDB.label_category_milvus')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('db.milvus.usage.delete_units', 'value', t('in-forge:plugins.oTelMilvusDB.service'))
    ],
    labels: [t('in-forge:plugins.oTelMilvusDB.dashboard.delete_units')],
    category: [t('in-forge:plugins.oTelMilvusDB.label_category_milvus')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('db.milvus.query.duration', 'value', t('in-forge:plugins.oTelMilvusDB.service'))],
    labels: [t('in-forge:plugins.oTelMilvusDB.dashboard.query_duration')],
    category: [t('in-forge:plugins.oTelMilvusDB.label_category_milvus')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('db.milvus.search.distance', 'value', t('in-forge:plugins.oTelMilvusDB.service'))],
    labels: [t('in-forge:plugins.oTelMilvusDB.dashboard.search_distance')],
    category: [t('in-forge:plugins.oTelMilvusDB.label_category_milvus')],
    min: 0,
    formatter: number
  }
];
