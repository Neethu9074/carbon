/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import { ActionInstance } from '@instana/types';

import { trackCurrentlySelected, trackDialogClosed } from 'in-automation/components/MarkersLane/tracker';
import ActionInstanceContent from 'in-automation/components/MarkersLane/ActionInstanceContent';
import ActionLaneDialogTitle from 'in-automation/components/MarkersLane/ActionLaneDialogTitle';
import ActionInstancesList from 'in-automation/components/MarkersLane/ActionInstancesList';
import { ActionListCalloutProps } from 'in-automation/components/MarkersLane/shared';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './ActionlaneDialogPresenter.mless';

export default function ActionlaneDialogPresenter({
  eventData,
  ...remainingProps
}: {
  eventData: ActionListCalloutProps;
}) {
  const { actionInstances: instances } = eventData;
  const isCluster = instances.length > 1;
  const title = isCluster
    ? t('in-automation:actionHistory.actionHistoryWithCount', { count: instances.length })
    : t('in-automation:actionHistory.actionHistory');

  const [selectedItem, setSelectedItem] = useState(instances[0]);

  useTrackItemSelect(selectedItem, instances);
  return (
    <Dialog
      title={<ActionLaneDialogTitle title={title} />}
      onClose={() => {
        trackDialogClosed({
          actions: instances,
          numberOfActions: instances.length
        });
        close();
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
            <ActionInstancesList
              {...remainingProps}
              actionInstances={instances}
              onItemClick={(item: ActionInstance) => setSelectedItem(item)}
            />
          </div>
        )}
        <div className={locals.contentWrapper}>
          <ActionInstanceContent {...remainingProps} eventData={eventData} actionInstance={selectedItem} />
        </div>
      </div>
    </Dialog>
  );

  function useTrackItemSelect(selectedItem: ActionInstance, instances: ActionInstance[]) {
    useEffect(() => {
      trackCurrentlySelected({
        selectedAction: selectedItem.actionName,
        numberOfActions: instances.length
      });
    }, [selectedItem, instances]);
  }
}
