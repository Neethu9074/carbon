/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import PotentialProblemsDialogPresenter from 'in-alerting/PotentialProblems/PotentialProblemDialog/PotentialProblemsDialogPresenter';
import PotentialProblemsHoverArea from 'in-alerting/PotentialProblems/PotentialProblemsLane/PotentialProblemsHoverArea';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialogWrapper';
import { potentialProblemsLaneAlertsPropType } from 'in-alerting/PotentialProblems/PotentialProblemsLane/proptypes';
import PotentialProblemMarker from 'in-alerting/PotentialProblems/PotentialProblemsLane/PotentialProblemMarker';
import SingleMarkerLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleMarkerLaneItem';
import { trackMarkerClicked, trackMarkerHovered } from 'in-alerting/PotentialProblems/tracker';
import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { getTitle } from 'in-alerting/PotentialProblems/textUtil';
import { t } from 'in-i18n';

export default function PotentialProblemsLanePresenter({
  potentialProblems,
  alertRules,
  openingDialogDisabled,
  ...remainingProps
}) {
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

  const defaultClickHandler = ({ alerts, thresholds }) => {
    addActiveDialog(
      <PotentialProblemsDialogPresenter
        {...remainingProps}
        alertRules={alertRules}
        alerts={alerts}
        thresholds={thresholds}
        renderSmartAlertDialogComponent={dialogProps => {
          const { applicationLabel } = remainingProps;
          return (
            <SmartAlertConfigDialogWrapper
              applicationLabel={applicationLabel}
              formData={{
                ...remainingProps,
                ...dialogProps
              }}
              onClose={close}
            />
          );
        }}
      />
    );
    trackMarkerClicked({ metricNames: getUniqueMetricNames(alertRules) });
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
        trackMarkerHovered({
          metricNames: getUniqueMetricNames(alertRules),
          numberOfProblems: eventData.alerts.length,
          chartName: remainingProps.chartName
        });
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
