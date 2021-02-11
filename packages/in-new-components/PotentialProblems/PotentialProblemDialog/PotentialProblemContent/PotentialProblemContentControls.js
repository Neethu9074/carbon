/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import {
  alertPropType,
  rulePropType,
  thresholdPropType
} from 'in-new-components/PotentialProblems/PotentialProblemsLane/proptypes';
import { trackCreateSmartAlert, trackGotoAnalyze } from 'in-new-components/PotentialProblems/tracker';
import { getLinkToUnboundAnalytics } from 'in-events/components/AnalyzeApplicationEventButton';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { defaultGranularity } from 'in-new-components/PotentialProblems/constants';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { close } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button/Button';
import { role } from 'in-stores/user';

export default function PotentialProblemContentControls({
  applicationLabel,
  tagFilters,
  tagFilterExpression,
  boundaryScope,
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
          applicationLabel,
          null, // is already included in given tagFilters/tagFilterExpression
          null, // is already included in given tagFilters/tagFilterExpression
          {
            boundaryScope,
            rule,
            threshold,
            tagFilters,
            tagFilterExpression,
            granularity: defaultGranularity,
            convertedTagFilterExpression: true
          },
          getTimeConfigForAnalyzeLink(alert),
          tagCatalog
        )}
      >
        Investigate
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
          Add Smart Alert
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
  applicationLabel: PropTypes.string.isRequired,
  boundaryScope: PropTypes.string,
  renderSmartAlertDialogComponent: PropTypes.func.isRequired,
  tagFilters: PropTypes.arrayOf(PropTypes.object).isRequired,
  tagFilterExpression: PropTypes.object.isRequired,
  threshold: thresholdPropType.isRequired
};
