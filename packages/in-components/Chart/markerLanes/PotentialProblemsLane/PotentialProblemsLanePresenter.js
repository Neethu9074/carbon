import PropTypes from 'prop-types';
import React from 'react';

import PotentialProblemsHoverArea from 'in-components/Chart/markerLanes/PotentialProblemsLane/PotentialProblemsHoverArea';
import { potentialProblemsLaneAlertsPropType } from 'in-components/Chart/markerLanes/PotentialProblemsLane/constants';
import PotentialProblemMarker from 'in-components/Chart/markerLanes/PotentialProblemsLane/PotentialProblemMarker';
import SingleMarkerLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleMarkerLaneItem';
import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';

/*
  TODO: Remove this when getTitlePlaceholder(form) in
  in-applications/alerting/form/formUtils is refactored
  so that it takes a JSON object instead of a form to build the message strings
*/
const messages = {
  errorRate: 'Error rate to high.',
  throughput: 'Throughput is too low.',
  slowness: 'Latency is to high'
};

export default function PotentialProblemsLanePresenter({ potentialProblems, ...remainingProps }) {
  const { alertConfig: allAlertConfigs, alertResults = [] } = potentialProblems;

  return (
    <MarkerLane
      {...remainingProps}
      events={alertResults}
      label="PotentialProblems"
      tooltipContent={params => {
        const { alerts } = params;

        let text = '';
        if (alerts.length > 1) {
          text = `${alerts.length} Potential Problems`;
        } else {
          const alertConfig = allAlertConfigs[alerts[0].key];
          text = messages[alertConfig.rule.alertType];
        }

        return <div>{text}</div>;
      }}
      renderHoverOverlay={PotentialProblemsHoverArea}
      onClick={() => {}}
      renderLaneItem={SingleMarkerLaneItem}
      renderMarkerItem={PotentialProblemMarker}
      hideDefaultHoverStyle
    />
  );
}

PotentialProblemsLanePresenter.propTypes = {
  potentialProblems: potentialProblemsLaneAlertsPropType,
  isClustered: PropTypes.bool
};
