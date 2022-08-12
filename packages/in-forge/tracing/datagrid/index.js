/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'datagrid',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'DatagridSpanDetailView',
  getLabel(span) {
    return span.getIn(['data', 'datagrid', 'operation']);
  }
});
