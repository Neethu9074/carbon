/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PotentialProblemsDialogPresenter from 'promise-loader?global,potentialProblems!in-alerting/PotentialProblems/PotentialProblemDialog/PotentialProblemsDialogPresenter';
import AlertConfigDialog from 'promise-loader?global,potentialProblems!in-alerting/smart-alerts/applications/dialog/AlertConfigDialog';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import PotentialProblemsHoverArea from 'in-alerting/PotentialProblems/PotentialProblemsLane/PotentialProblemsHoverArea';
import { POTENTIAL_PROBLEMS_MARKER_HOVERED, POTENTIAL_PROBLEMS_MARKER_CLICKED } from 'in-services/tracking/eventNames';
import { potentialProblemsLaneAlertsPropType } from 'in-alerting/PotentialProblems/PotentialProblemsLane/proptypes';
import PotentialProblemMarker from 'in-alerting/PotentialProblems/PotentialProblemsLane/PotentialProblemMarker';
import SingleMarkerLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleMarkerLaneItem';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { getTitle } from 'in-alerting/PotentialProblems/textUtil';
import { UI_INTERACTION } from 'in-services/util/constants';
import { t } from 'in-i18n';

const DeferredPotentialProblemsDialogPresenter = createAsyncViewComponent(PotentialProblemsDialogPresenter);
const DeferredAlertConfigDialog = createAsyncViewComponent(AlertConfigDialog);
export default function PotentialProblemsLanePresenter({
  potentialProblems,
  alertRules,
  openingDialogDisabled,
  ...remainingProps
}) {
  const { trackCta, unstable_trackEvent } = useSegmentTracking();
  const events = useMemo(() => {
    function buildPotentialProblemEventObject({ alerts, lastStart, lastEnd, granularity, thresholds }) {
      const lastStartShifted = adjustTimestampFraction(lastStart, granularity) - granularity / 2;
      const lastEndShifted = adjustTimestampFraction(lastEnd, granularity) + granularity / 2;
      return {
        alerts: alerts,
        timestamp: lastStartShifted,
        duration: lastEndShifted - lastStartShifted,
        thresholds
      };
    }

    function adjustTimestampFraction(lastStartOrEnd, granularity) {
      return Math.floor(lastStartOrEnd / granularity) * granularity;
    }

    const { granularity } = remainingProps;
    const { thresholds } = potentialProblems;

    const alerts = potentialProblems.alerts;
    if (alerts.length === 0) return [];
    if (alerts.length === 1) {
      return [
        buildPotentialProblemEventObject({
          alerts: [alerts[0]],
          lastStart: alerts[0].start,
          lastEnd: alerts[0].end,
          granularity,
          thresholds
        })
      ];
    }

    const events = [];
    let alertClusters = [alerts[0]];
    let lastStart = alertClusters[0].start;
    let lastEnd = alertClusters[0].end;

    for (let i = 1; i < alerts.length; i++) {
      const alert = alerts[i];

      if (alert.start <= lastEnd + granularity) {
        lastEnd = Math.max(lastEnd, alert.end);
        alertClusters.push(alert);
      } else {
        events.push(
          buildPotentialProblemEventObject({
            alerts: alertClusters,
            lastEnd,
            lastStart,
            granularity,
            thresholds
          })
        );

        // start new cluster
        lastStart = alert.start;
        lastEnd = alert.end;
        alertClusters = [alert];
      }
    }

    events.push(
      buildPotentialProblemEventObject({
        alerts: alertClusters,
        lastEnd,
        lastStart,
        granularity,
        thresholds
      })
    );

    return events;
  }, [potentialProblems, remainingProps]);

  const constructRules = dialogProps => [
    {
      rule: dialogProps.rule,
      thresholdOperator: dialogProps.threshold.operator,
      thresholds: {
        WARNING: { ...dialogProps.threshold, isCheckboxSelected: true },
        CRITICAL: {
          type: dialogProps.threshold.type,
          deviationFactor: defaultDeviationFactor,
          value: null,
          isCheckboxSelected: false
        }
      }
    }
  ];

  const defaultClickHandler = ({ alerts, thresholds }) => {
    addActiveDialog(
      <DeferredPotentialProblemsDialogPresenter
        {...remainingProps}
        alertRules={alertRules}
        alerts={alerts}
        thresholds={thresholds}
        getPotentialProblemConfig={dialogProps => {
          return {
            ...remainingProps,
            ...dialogProps,
            rules: constructRules(dialogProps)
          };
        }}
        renderSmartAlertDialogComponent={dialogProps => {
          const { applicationLabel } = remainingProps;
          const alertConfig = {
            ...remainingProps,
            ...dialogProps,
            rules: constructRules(dialogProps)
          };
          return (
            <DeferredAlertConfigDialog
              applicationLabel={applicationLabel}
              alertConfig={alertConfig}
              onClose={close}
              startWithSimpleMode
            />
          );
        }}
      />
    );
    trackCta(POTENTIAL_PROBLEMS_MARKER_CLICKED, { metricNames: getUniqueMetricNames(alertRules) });
  };

  return (
    <MarkerLane
      {...remainingProps}
      events={events}
      isClustered={false}
      label={t('in-alerting:potentialProblems.titlePotentialProblems')}
      tooltipContent={({ alerts }) => {
        let text = '';
        if (alerts.length > 1) {
          text = t('in-alerting:potentialProblems.labelNumbersOfPotentialProblem', { count: alerts.length });
        } else {
          const { thresholds } = potentialProblems;
          const key = alerts[0].key;
          text = getTitle({ rule: alertRules[key].rule, threshold: thresholds[key] });
        }
        return <>{text}</>;
      }}
      HoverOverlay={PotentialProblemsHoverArea}
      onClick={openingDialogDisabled ? undefined : defaultClickHandler}
      LaneItem={SingleMarkerLaneItem}
      renderMarkerItem={PotentialProblemMarker}
      trackMarkerHoverEvent={eventData => {
        unstable_trackEvent(
          UI_INTERACTION,
          { CTA: POTENTIAL_PROBLEMS_MARKER_HOVERED },
          {
            metricNames: getUniqueMetricNames(alertRules),
            numberOfProblems: eventData.alerts.length,
            chartName: remainingProps.chartName
          }
        );
      }}
      hideDefaultHoverStyle
    />
  );

  function getUniqueMetricNames(alertRules) {
    const uniqueMetricNames = new Set();
    for (const { rule } of Object.values(alertRules)) {
      uniqueMetricNames.add(rule.metricName);
    }
    return Array.from(uniqueMetricNames);
  }
}

PotentialProblemsLanePresenter.propTypes = {
  potentialProblems: potentialProblemsLaneAlertsPropType.isRequired,
  openingDialogDisabled: PropTypes.bool,
  isClustered: PropTypes.bool,
  applicationLabel: PropTypes.string,
  serviceLabel: PropTypes.string,
  endpointLabel: PropTypes.string,
  applicationBoundaryScope: PropTypes.string,
  alertRules: PropTypes.shape({
    // this object can contain multiples keys, but it's not possible to express this with propTypes
    key: PropTypes.shape({
      rule: PropTypes.shape({
        alertType: PropTypes.string,
        metricName: PropTypes.string,
        aggregation: PropTypes.string
      })
    })
  })
};
