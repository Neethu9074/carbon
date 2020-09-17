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
import { getTitle } from 'in-new-components/PotentialProblems/textUtil';

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
            text = getTitle({ ...alertConfig });
          }
          return <>{text}</>;
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
