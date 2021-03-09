/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import { applicationsItemTreePropType } from 'in-alerting/smart-alerts/components/smart-alert-dialog/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import {
  alertPropType,
  rulePropType,
  thresholdPropType
} from 'in-alerting/PotentialProblems/PotentialProblemsLane/proptypes';
import { trackCreateSmartAlert, trackGotoAnalyze } from 'in-alerting/PotentialProblems/tracker';
import { getLinkToUnboundAnalytics } from 'in-events/components/AnalyzeApplicationEventButton';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { defaultGranularity } from 'in-alerting/PotentialProblems/constants';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { close } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button/Button';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function PotentialProblemContentControls({
  applicationId,
  applicationLabel,
  boundaryScope,
  applications,
  tagFilterExpression,
  includeSynthetic,
  alert,
  rule,
  threshold,
  renderSmartAlertDialogComponent
}) {
  const tagCatalog = useTagCatalog(getTagCatalog);
  return (
    <>
      <Button
        kind="primary"
        onClick={e => {
          e.stopPropagation();
          trackGotoAnalyze({
            metricName: rule.metricName
          });
          close();
        }}
        icon="lib_analyze"
        href$={getLinkToUnboundAnalytics(
          applicationId,
          applicationLabel,
          null, // is already included in given tagFilterExpression
          null,
          null, // is already included in given tagFilterExpression
          null,
          {
            boundaryScope,
            applications,
            rule,
            threshold,
            tagFilterExpression,
            includeSynthetic,
            granularity: defaultGranularity,
            convertedTagFilterExpression: true
          },
          getTimeConfigForAnalyzeLink(alert),
          tagCatalog
        )}
      >
        {t('in-alerting:potentialProblems.buttonInvestigate')}
      </Button>
      {role.canConfigureCustomAlerts && (
        <Button
          kind="secondaryDarker"
          onClick={() => {
            addActiveDialog(
              renderSmartAlertDialogComponent({
                rule,
                threshold,
                applicationLabel,
                boundaryScope,
                granularity: defaultGranularity
              })
            );
            trackCreateSmartAlert({
              metricName: rule.metricName
            });
          }}
          icon="lib_alerts_create"
        >
          {t('in-alerting:potentialProblems.buttonAddSmartAlert')}
        </Button>
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
  applicationId: PropTypes.string.isRequired,
  applicationLabel: PropTypes.string.isRequired,
  applications: applicationsItemTreePropType,
  boundaryScope: PropTypes.string,
  renderSmartAlertDialogComponent: PropTypes.func.isRequired,
  tagFilterExpression: PropTypes.object.isRequired,
  includeSynthetic: PropTypes.bool,
  threshold: thresholdPropType.isRequired
};
