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

export default function PotentialProblemsLanePresenter({
  potentialProblems,
  alertRules,
  outsideShortTermCallsStore,
  ...remainingProps
}) {
  if (outsideShortTermCallsStore) return null;

  const events = useMemo(() => {
    const alerts = potentialProblems.alerts;
    if (alerts.length === 0) return [];
    if (alerts.length === 1) {
      return [
        {
          alerts: [alerts[0]],
          timestamp: alerts[0].start,
          duration: alerts[0].end - alerts[0].start,
          thresholds: potentialProblems.thresholds
        }
      ];
    }

    const events = [];
    let alertClusters = [alerts[0]];
    let lastStart = alertClusters[0].start;
    let lastEnd = alertClusters[0].end;

    for (let i = 1; i < alerts.length; i++) {
      const alert = alerts[i];

      if (alert.start <= lastEnd + remainingProps.clusterSizeMillis) {
        lastEnd = Math.max(lastEnd, alert.end);
        alertClusters.push(alert);
      } else {
        events.push({
          alerts: alertClusters,
          timestamp: lastStart,
          duration: lastEnd - lastStart,
          thresholds: potentialProblems.thresholds
        });

        // start new cluster
        lastStart = alert.start;
        lastEnd = alert.end;
        alertClusters = [alert];
      }
    }

    events.push({
      alerts: alertClusters,
      timestamp: lastStart,
      duration: lastEnd - lastStart,
      thresholds: potentialProblems.thresholds
    });

    return events;
  }, [...potentialProblems]);

  return (
    <MarkerLane
      {...remainingProps}
      events={events}
      isCluster={false}
      label="PotentialProblems"
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
              const tagFilters = [
                {
                  name: 'application.name',
                  operator: 'EQUALS',
                  stringValue: applicationLabel
                }
              ];

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
                  applicationLabel={remainingProps.applicationLabel}
                  formData={{
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
  }),
  outsideShortTermCallsStore: PropTypes.bool
};
