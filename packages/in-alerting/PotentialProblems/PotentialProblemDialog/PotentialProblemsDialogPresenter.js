/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import PotentialProblemContent from 'in-alerting/PotentialProblems/PotentialProblemDialog/PotentialProblemContent/PotentialProblemContent';
import { alertRulesPropType, thresholdsPropType } from 'in-alerting/PotentialProblems/PotentialProblemsLane/proptypes';
import PotentialProblemsList from 'in-alerting/PotentialProblems/PotentialProblemDialog/PotentialProblemsList';
import { trackCurrentlySelected, trackDialogClosed } from 'in-alerting/PotentialProblems/tracker';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from 'in-alerting/PotentialProblems/PotentialProblemDialog/PotentialProblemsDialogPresenter.mless';

export default function PotentialProblemsDialogPresenterAlertChecker(props) {
  if (!props.alerts) {
    return null;
  }
  return <PotentialProblemsDialogPresenter {...props} />;
}

function PotentialProblemsDialogPresenter({ alertRules, thresholds, alerts, ...remainingProps }) {
  const isCluster = alerts.length > 1;
  const title = isCluster
    ? t('in-alerting:potentialProblems.titlePotentialProblemWithCount', { count: alerts.length })
    : t('in-alerting:potentialProblems.titlePotentialProblem');

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
        className={classNames({
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
    // Deliberately executing Mixpanel tracking on these prop changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alert, rule, threshold]);
}

PotentialProblemsDialogPresenter.propTypes = {
  alertRules: alertRulesPropType.isRequired,
  alerts: PropTypes.arrayOf(PropTypes.object).isRequired,
  thresholds: thresholdsPropType.isRequired
};
