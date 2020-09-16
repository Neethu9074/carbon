import PropTypes from 'prop-types';
import React from 'react';

import PotentialProblemsDialogPresenter from 'in-new-components/PotentialProblems/PotentialProblemDialog/PotentialProblemsDialogPresenter';
import PotentialProblemsHoverArea from 'in-new-components/PotentialProblems/PotentialProblemsLane/PotentialProblemsHoverArea';
import { potentialProblemsLaneAlertsPropType } from 'in-new-components/PotentialProblems/PotentialProblemsLane/proptypes';
import PotentialProblemMarker from 'in-new-components/PotentialProblems/PotentialProblemsLane/PotentialProblemMarker';
import SmartAlertConfigDialogWrapper from 'in-applications/alerting/Dialog/SmartAlertConfigDialogWrapper';
import { generateFormData } from 'in-applications/Dashboards/CreateApplicationSmartAlertFromLaneDialog';
import SingleMarkerLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleMarkerLaneItem';
import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import DialogPresenter from 'in-components/DialogPresenter';

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
    <>
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
        onClick={alertResult => {
          addActiveDialog(
            <PotentialProblemsDialogPresenter
              {...remainingProps}
              alertConfig={allAlertConfigs}
              alertResult={alertResult}
              renderSmartAlertDialogComponent={() => (
                <SmartAlertConfigDialogWrapper
                  applicationLabel={remainingProps.applicationLabel}
                  formData={generateFormData(remainingProps)}
                  onClose={close}
                />
              )}
            />
          );
        }}
        renderLaneItem={SingleMarkerLaneItem}
        renderMarkerItem={PotentialProblemMarker}
        hideDefaultHoverStyle
      />
      <DialogPresenter />
    </>
  );
}

PotentialProblemsLanePresenter.propTypes = {
  potentialProblems: potentialProblemsLaneAlertsPropType,
  isClustered: PropTypes.bool,
  applicationLabel: PropTypes.string,
  serviceLabel: PropTypes.string,
  endpointLabel: PropTypes.string,
  applicationBoundaryScope: PropTypes.string
};
