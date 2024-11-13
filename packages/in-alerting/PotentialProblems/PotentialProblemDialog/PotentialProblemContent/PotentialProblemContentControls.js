/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@instana/components';

import { applicationsItemTreePropType } from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import {
  alertPropType,
  rulePropType,
  thresholdPropType
} from 'in-alerting/PotentialProblems/PotentialProblemsLane/proptypes';
import {
  POTENTIAL_PROBLEMS_SMART_ALERT_CREATE,
  POTENTIAL_PROBLEMS_GO_TO_ANALYZE
} from 'in-services/tracking/eventNames';
import {
  applicationSmartAlertFullScreenDesignEnabled,
  applicationSmartAlertDialogView
} from 'in-services/featureFlags';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/applications/hooks/useSmartAlertCreateUrl';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { getLinkToUnboundAnalytics } from 'in-events/components/AnalyzeApplicationEventButton';
import { getButtonName } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { defaultGranularity } from 'in-alerting/PotentialProblems/constants';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { close } from 'in-components/DialogPresenter/store';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function PotentialProblemContentControls({
  applicationId,
  applicationLabel,
  boundaryScope,
  applications,
  tagFilterExpression,
  includeSynthetic,
  includeInternal,
  alert,
  rule,
  threshold,
  getPotentialProblemConfig,
  renderSmartAlertDialogComponent
}) {
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl();
  const smartAlertCreatePath = getLinkToCreateSmartAlert({ isGlobal: false, migration: false, potentialProblem: true });
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();
  const rules = [
    {
      rule: rule,
      thresholdOperator: threshold.operator,
      thresholds: {
        WARNING: { ...threshold },
        CRITICAL: { type: threshold.type, deviationFactor: 0, value: null }
      }
    }
  ];
  const linkToUnboundAnalytics = getLinkToUnboundAnalytics(
    {
      applicationId,
      applicationName: applicationLabel,
      alertConfig: {
        boundaryScope,
        applications,
        rule,
        threshold,
        rules,
        tagFilterExpression,
        includeSynthetic,
        includeInternal,
        granularity: defaultGranularity
      },
      timeConfig: getTimeConfigForAnalyzeLink(alert)
    },
    getLinkToApplicationAnalyze
  );
  const { trackCta } = useSegmentTracking();

  return (
    <>
      <Button
        kind="primary"
        onClick={e => {
          e.stopPropagation();
          trackCta(POTENTIAL_PROBLEMS_GO_TO_ANALYZE, {
            metricName: rule.metricName
          });
          close();
        }}
        icon="lib_analyze"
        href={linkToUnboundAnalytics}
      >
        {t('in-alerting:potentialProblems.buttonInvestigate')}
      </Button>
      {role.canConfigureApplicationSmartAlerts && applicationId && applicationLabel && (
        <>
          {applicationSmartAlertDialogView && (
            <Button
              kind="secondaryDarker"
              onClick={() => {
                close();
                addActiveDialog(
                  renderSmartAlertDialogComponent({
                    rule,
                    threshold,
                    applicationLabel,
                    boundaryScope,
                    granularity: defaultGranularity
                  })
                );
                trackCta(POTENTIAL_PROBLEMS_SMART_ALERT_CREATE, {
                  metricName: rule.metricName
                });
              }}
              icon="lib_alerts_create"
            >
              {t('in-alerting:potentialProblems.buttonAddSmartAlert')}
            </Button>
          )}
          {applicationSmartAlertFullScreenDesignEnabled && (
            <Button
              icon="lib_alerts_create"
              kind="secondaryDarker"
              href={smartAlertCreatePath}
              onClick={e => {
                localStorage.setItem(
                  'potentialProblemConfig',
                  JSON.stringify(
                    getPotentialProblemConfig({
                      rule,
                      threshold,
                      applicationLabel,
                      boundaryScope,
                      granularity: defaultGranularity
                    })
                  )
                );

                trackCta(POTENTIAL_PROBLEMS_SMART_ALERT_CREATE, {
                  metricName: rule.metricName
                });
                e.stopPropagation();
                close();
              }}
            >
              {getButtonName(t('in-alerting:smartAlerts.applications.components.createSmartAlert'))}
            </Button>
          )}
        </>
      )}
    </>
  );
}

function getTimeConfigForAnalyzeLink({ start, end }) {
  const eventDuration = end - start;
  const duration = eventDuration * 2;
  const to = end + eventDuration * 0.5;
  return {
    to,
    windowSize: duration
  };
}

PotentialProblemContentControls.propTypes = {
  alert: alertPropType.isRequired,
  rule: rulePropType.isRequired,
  applicationId: PropTypes.string,
  applicationLabel: PropTypes.string,
  applications: applicationsItemTreePropType,
  boundaryScope: PropTypes.string,
  getPotentialProblemConfig: PropTypes.func.isRequired,
  renderSmartAlertDialogComponent: PropTypes.func.isRequired,
  tagFilterExpression: PropTypes.object.isRequired,
  includeSynthetic: PropTypes.bool,
  includeInternal: PropTypes.bool,
  threshold: thresholdPropType.isRequired
};
