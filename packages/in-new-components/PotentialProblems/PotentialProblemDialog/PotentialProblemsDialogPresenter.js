import React, { useState } from 'react';

import PotentialProblemContent from 'in-new-components/PotentialProblems/PotentialProblemDialog/PotentialProblemContent/PotentialProblemContent';
import PotentialProblemsList from 'in-new-components/PotentialProblems/PotentialProblemDialog/PotentialProblemsList';
import evaluateClassNames from 'in-services/util/classnames';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';

import locals from './PotentialProblemsDialogPresenter.mless';

export default function PotentialProblemsDialogPresenter({ alertConfig, alertResult, ...remainingProps }) {
  const isCluster = alertResult.alerts.length > 1;
  const title = `Potential Problem${isCluster ? `s (${alertResult.alerts.length})` : ''}`;
  const [selectedItem, setSelectedItem] = useState(alertResult.alerts[0]);

  return (
    <Dialog title={title} onClose={close} withoutBodyPadding>
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
              alerts={alertResult.alerts}
              alertConfig={alertConfig}
              onItemClick={item => setSelectedItem(item)}
            />
          </div>
        )}
        <div className={locals.contentWrapper}>
          <PotentialProblemContent
            {...remainingProps}
            alert={selectedItem}
            alertConfigs={alertConfig}
            selectedItem={selectedItem}
          />
        </div>
      </div>
    </Dialog>
  );
}
