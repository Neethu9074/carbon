/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'zf',
  category: 'generic',
  direction: 'local',

  typeName: {
    singular: 'Zend Framework',
    plural: 'Zend Frameworks'
  },

  detailView: 'ZendFrameworkSpanDetailView',

  getLabel(span) {
    const module = span.getIn(['data', 'zf', 'module']);
    const controller = span.getIn(['data', 'zf', 'controller']);
    const action = span.getIn(['data', 'zf', 'action']);

    if (module && controller && action) {
      return module + ':' + controller + '::' + action;
    }
    if (controller && action) {
      return controller + '::' + action;
    }
    if (controller && !action) {
      t('in-forge:tracing.zf.controllerUnknown', { controllerVar: controller });
    }
    if (!controller && !action) {
      return t('in-forge:tracing.zf.unknownAction', { actionVar: action});
    }
    return t('in-forge:tracing.zf.zendFramework');
  }
});
