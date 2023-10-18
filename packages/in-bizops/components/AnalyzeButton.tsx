/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import { clickBizopsProcessAnalyzeInstancesTracker } from 'in-bizops/tracker';
import { useLinkToAnalyze } from 'in-bizops/navigation/paths';
import { t } from 'in-i18n';

/* 
This is the Analyze Instances button in the Business Monitoring page that
leads the user to the Analytics page component in-bizops/analyze/AnalyzeView/AnalyzeView
The routing can be found in in-bizops/navigation/routes
*/
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
  const linkToAnalyze = useLinkToAnalyze(businessProcessName, businessActivityName);
  return (
    <Button
      kind="primary"
      icon="lib_application_call"
      href={linkToAnalyze}
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
