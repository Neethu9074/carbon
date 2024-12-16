/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { ActionListCalloutProps } from 'in-automation/components/MarkersLane/shared';
import { trackGoToInvestigate } from 'in-automation/components/MarkersLane/tracker';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

export default function ActionlaneDialogControls({
  actionId,
  eventData
}: {
  actionId: string;
  eventData: ActionListCalloutProps;
}) {
  const { boundaryScope, labels, snapshotHostFqdn, hasButtonInActionslane } = eventData;
  const { applicationLabel, serviceLabel, endpointLabel } = labels;
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();

  const tagFilterExpression = tagFilter('host.fqdn', 'EQUALS', snapshotHostFqdn, null, DESTINATION);

  const href = getLinkToApplicationAnalyze({
    applicationName: applicationLabel,
    serviceName: serviceLabel,
    endpointName: endpointLabel,
    boundaryScope: boundaryScope,
    dataSource: 'calls',
    formModel: snapshotHostFqdn ? [tagFilterExpression] : joinExpressions({ expressions: [[], []] }),
    groupBy: createGroupBy('application.name', DESTINATION)
  });
  if (!hasButtonInActionslane) {
    return null;
  }

  return (
    <>
      <Button
        kind="primary"
        onClick={e => {
          e.stopPropagation();
          trackGoToInvestigate({
            actionId: actionId,
            applicationName: applicationLabel,
            serviceName: serviceLabel,
            endpointName: endpointLabel,
            snapshotHostFqdn: snapshotHostFqdn
          });
          close();
        }}
        icon="lib_analyze"
        href={href}
      >
        {t('in-automation:actionLanes.buttonInvestigate')}
      </Button>
    </>
  );
}
