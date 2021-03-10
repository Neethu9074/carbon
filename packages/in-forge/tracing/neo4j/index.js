/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'neo4j',
  category: 'database',
  typeName: {
    singular: t('in-forge:tracing.neo4j.indexName', { count: 1 }),
    plural: t('in-forge:tracing.neo4j.indexName', { count: 2 })
  },
  detailView: 'Neo4jSpanDetailView'
});
