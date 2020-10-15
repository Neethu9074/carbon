import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import PotentialProblemsDialogPresenter from 'in-new-components/PotentialProblems/PotentialProblemDialog/PotentialProblemsDialogPresenter';
import PotentialProblemsHoverArea from 'in-new-components/PotentialProblems/PotentialProblemsLane/PotentialProblemsHoverArea';
import { potentialProblemsLaneAlertsPropType } from 'in-new-components/PotentialProblems/PotentialProblemsLane/proptypes';
import PotentialProblemMarker from 'in-new-components/PotentialProblems/PotentialProblemsLane/PotentialProblemMarker';
import SmartAlertConfigDialogWrapper from 'in-applications/alerting/Dialog/SmartAlertConfigDialogWrapper';
import SingleMarkerLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleMarkerLaneItem';
import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { getTitle } from 'in-new-components/PotentialProblems/textUtil';

export default function PotentialProblemsLanePresenter({ potentialProblems, alertRules, ...remainingProps }) {
  const events = useMemo(() => {
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
  }, [...potentialProblems]);

  return (
    <MarkerLane
      {...remainingProps}
      events={events}
      isClustered={false}
      label="Potential Problems"
      tooltipContent={({ alerts }) => {
        let text = '';
        if (alerts.length > 1) {
          text = `${alerts.length} Potential Problems`;
        } else {
          const { thresholds } = potentialProblems;
          const key = alerts[0].key;
          text = getTitle({ rule: alertRules[key].rule, threshold: thresholds[key] });
        }
        return <>{text}</>;
      }}
      renderHoverOverlay={PotentialProblemsHoverArea}
      onClick={({ alerts, thresholds }) => {
        addActiveDialog(
          <PotentialProblemsDialogPresenter
            {...remainingProps}
            alertRules={alertRules}
            alerts={alerts}
            thresholds={thresholds}
            renderSmartAlertDialogComponent={dialogProps => {
              const { applicationLabel, serviceLabel, endpointLabel } = remainingProps;
              const tagFilters = [];

              if (serviceLabel) {
                tagFilters.push({
                  name: 'service.name',
                  operator: 'EQUALS',
                  stringValue: serviceLabel
                });
              }

              if (endpointLabel) {
                tagFilters.push({
                  name: 'endpoint.name',
                  operator: 'EQUALS',
                  stringValue: endpointLabel
                });
              }

              return (
                <SmartAlertConfigDialogWrapper
                  applicationLabel={applicationLabel}
                  formData={{
                    ...remainingProps,
                    ...dialogProps,
                    tagFilters
                  }}
                  onClose={close}
                />
              );
            }}
          />
        );
      }}
      renderLaneItem={SingleMarkerLaneItem}
      renderMarkerItem={PotentialProblemMarker}
      hideDefaultHoverStyle
    />
  );
}

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

PotentialProblemsLanePresenter.propTypes = {
  potentialProblems: potentialProblemsLaneAlertsPropType,
  isClustered: PropTypes.bool,
  applicationLabel: PropTypes.string,
  serviceLabel: PropTypes.string,
  endpointLabel: PropTypes.string,
  applicationBoundaryScope: PropTypes.string,
  alertRules: PropTypes.shape({
    // this object can contain multiples keys, but it's not possible to expresse this with propTypes
    key: PropTypes.shape({
      rule: PropTypes.shape({
        alertType: PropTypes.string,
        metricName: PropTypes.string,
        aggregation: PropTypes.string
      })
    })
  })
};
