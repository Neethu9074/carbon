/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { clickBizopsProcessAnalyzeInstancesTracker } from 'in-bizops/tracker';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { useLinkToAnalyze } from 'in-applications/navigation/paths';
import { t } from 'in-i18n';

/* This component directs the user to the Analyze page, with filters set
to the specific Business Process they are currently in.  Filters also
include the activity name if not empty */
interface AnalyzeButtonProps {
  businessProcessId: string;
  businessProcessName: string;
  businessActivityName: string;
}
export default function AnalyzeButton({
  businessProcessId,
  businessProcessName,
  businessActivityName
}: AnalyzeButtonProps) {
  // We use the applications analytics implementation since there is no point
  // duplicating code.
  const getLinkToAnalyze = useLinkToAnalyze();
  return (
    <Button
      kind="primary"
      icon="lib_application_call"
      href={getLinkToAnalyze({
        formModel: formModelBuilder(businessProcessId, businessActivityName),
        groupBy: {
          groupbyTag: 'call.bpm.root.process.instance.id'
        },
        hiddenCalls: {
          includeInternal: true,
          includeSynthetic: false
        },
        fastQueryModeEnabled: true
      })}
      onClick={() => {
        clickBizopsProcessAnalyzeInstancesTracker({
          processId: businessProcessId,
          processName: businessProcessName,
          activityName: businessActivityName
        });
      }}
    >
      {t('in-bizops:dashboards.analyzeInstances')}
    </Button>
  );
}

function formModelBuilder(businessProcessId: string, businessActivityName: string) {
  let formModel: FormModelElement[] = [tagFilter('call.bpm.process.definition.id', EQUALS, businessProcessId)];

  // For when the user clicks on analyze instances in
  // the individual activity page
  if (businessActivityName) {
    formModel.push(
      { type: 'CONJUNCTION', logicalOperator: 'AND' },
      tagFilter('call.bpm.activity.name', EQUALS, businessActivityName)
    );
  }

  formModel.push(
    { type: 'CONJUNCTION', logicalOperator: 'AND' },
    { type: 'OPEN_BRACKET' },
    tagFilter('call.type', EQUALS, 'BATCH'),
    { type: 'CONJUNCTION', logicalOperator: 'OR' },
    tagFilter('call.type', EQUALS, 'INTERNAL'),
    { type: 'CLOSE_BRACKET' }
  );

  return formModel;
}
