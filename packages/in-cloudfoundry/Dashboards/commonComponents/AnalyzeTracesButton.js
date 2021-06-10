/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import getCloudfoundryApplication from 'in-cloudfoundry/subscriptions/getCloudfoundryApplication';
import { defaultGroupings as defaultApplicationGroupings } from 'in-applications/tags';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getLinkToAnalyze } from 'in-applications/navigation/paths';
import connect from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connect(({ applicationId, timeConfig }) => ({
  application: getCloudfoundryApplication({
    filter: {
      applicationId,
      timeConfig
    }
  }).map(result => result.data)
}))(function AnalyzeTracesButton({ application }) {
  return (
    <Button
      kind="primary"
      icon="lib_application_call"
      disabled={!application}
      href$={getLinkToAnalyze({
        dataSource: 'calls',
        formModel: joinExpressions({
          expressions: [
            tagFilter('cloudfoundry.application.id', EQUALS, application?.guid),
            tagFilter('cloudfoundry.application.name', EQUALS, application?.label)
          ]
        }),
        groupBy: defaultApplicationGroupings.calls
      })}
    >
      {t('in-cloudfoundry:dashboards.analyzeCalls')}
    </Button>
  );
});
