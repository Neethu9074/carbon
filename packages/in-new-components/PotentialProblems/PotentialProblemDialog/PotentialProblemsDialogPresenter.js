import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import PotentialProblemContent from 'in-new-components/PotentialProblems/PotentialProblemDialog/PotentialProblemContent/PotentialProblemContent';
import {
  alertRulesPropType,
  thresholdsPropType
} from 'in-new-components/PotentialProblems/PotentialProblemsLane/proptypes';
import PotentialProblemsList from 'in-new-components/PotentialProblems/PotentialProblemDialog/PotentialProblemsList';
import { trackCurrentlySelected, trackDialogClosed } from 'in-new-components/PotentialProblems/tracker';
import evaluateClassNames from 'in-services/util/classnames';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';

import locals from './PotentialProblemsDialogPresenter.mless';

export default function PotentialProblemsDialogPresenterAlertChecker(props) {
  if (!props.alerts) {
    return null;
  }
  return <PotentialProblemsDialogPresenter {...props} />;
}

function PotentialProblemsDialogPresenter({ alertRules, thresholds, alerts, ...remainingProps }) {
  const isCluster = alerts.length > 1;
  const title = `Potential Problem${isCluster ? `s (${alerts.length})` : ''}`;

  const [selectedItem, setSelectedItem] = useState(alerts[0]);
  const ruleSelected = alertRules[selectedItem.key].rule;
  const thresholdSelected = thresholds[selectedItem.key];

  useTrackItemSelect(thresholdSelected, alerts, ruleSelected);

  return (
    <Dialog
      title={title}
      onClose={() => {
        close();
        trackDialogClosed({
          metricName: ruleSelected.metricName,
          numberOfProblems: alerts.length
        });
      }}
      withoutBodyPadding
    >
      <div
        className={evaluateClassNames({
          [locals.container]: true,
          [locals.twoColums]: isCluster
        })}
      >
        {isCluster && (
          <div className={locals.listWrapper}>
            <PotentialProblemsList
              {...remainingProps}
              alerts={alerts}
              onItemClick={item => setSelectedItem(item)}
              thresholds={thresholds}
              alertRules={alertRules}
            />
          </div>
        )}
        <div className={locals.contentWrapper}>
          <PotentialProblemContent
            {...remainingProps}
            alert={selectedItem}
            threshold={thresholdSelected}
            rule={ruleSelected}
          />
        </div>
      </div>
    </Dialog>
  );
}

function useTrackItemSelect(threshold, alerts, rule) {
  useEffect(() => {
    trackCurrentlySelected({
      metricName: threshold.metricName,
      numberOfProblems: alerts.length
    });
  }, [alert, rule, threshold]);
}

PotentialProblemsDialogPresenter.propTypes = {
  alertRules: alertRulesPropType.isRequired,
  alerts: PropTypes.arrayOf(PropTypes.object).isRequired,
  thresholds: thresholdsPropType.isRequired
};
