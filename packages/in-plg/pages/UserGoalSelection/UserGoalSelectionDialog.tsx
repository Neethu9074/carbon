/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';

import { Card, Checkbox, DashboardButton, Stack, SvgIcon, Typography } from '@instana/components';

import { GOAL_SELECTION, GOALS, TOGGLER } from 'in-plg/pages/UserGoalSelection/utils/consts';
import { carbonCheckboxEnabled, carbonTileEnabled } from 'in-services/featureFlags';
import OtherGoalField from 'in-plg/pages/UserGoalSelection/OtherGoalField';
import { segmentTrackingFunc } from 'in-plg/utils/Segment/segment';
import { UserGoal } from 'in-plg/pages/UserGoalSelection/types';
import { close } from 'in-components/DialogPresenter/store';
import { DialogContent } from 'in-plg/components/Dialog';
import { CTA_CLICKED } from 'in-services/util/constants';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from 'in-plg/pages/UserGoalSelection/UserGoalSelection.mless';

const UserGoalSelectionDialog = () => {
  const [selectedGoals, setSelectedGoals] = useState<UserGoal[]>([]);
  const [showOtherGoal, setShowOtherGoal] = useState<boolean>(false);
  const [otherGoal, setOtherGoal] = useState<string>('');

  const isGoalSelected = (goal: UserGoal) => selectedGoals.some(selectedGoal => selectedGoal.id === goal.id);
  const goalSelectHandler = (goal: UserGoal) => {
    const checked: boolean = !isGoalSelected(goal);
    goalSetHandler(checked, goal, setShowOtherGoal, setOtherGoal, setSelectedGoals);
  };

  return (
    <Dialog
      className={locals.dialog}
      title={
        <Typography noMargin variant="heading-06">
          {t('in-plg:userGoalSelectionDialog.title')}
        </Typography>
      }
      onClose={closeHandler}
      withoutBodyPadding
    >
      <div className={locals.dalogContentWrapper} data-testid="user-goal-selection">
        <DialogContent>
          <Typography variant="body-regular">{t('in-plg:userGoalSelectionDialog.description')}</Typography>
          <div className={locals.stackWrapper}>
            <Stack direction="horizontal" gap="xxsmall" wrap>
              {GOALS.map(goal => (
                <div key={goal.id} onClick={() => goalSelectHandler(goal)} className={locals.cardWrap}>
                  <Card
                    bodyClassName={locals.cardBody}
                    className={classNames({
                      [locals.card]: true,
                      [locals.borderedCard]: isGoalSelected(goal),
                      [locals.legacyCard]: !carbonTileEnabled
                    })}
                    headerClassName={locals.cardHeader}
                    leftHeaderContent={<span className={locals.leftHeader}>{goal.text}</span>}
                    rightHeaderContent={
                      <Checkbox
                        checked={isGoalSelected(goal)}
                        className={classNames({
                          [locals.cardLegacyCheckBox]: !carbonCheckboxEnabled
                        })}
                      />
                    }
                    size="l"
                  >
                    <SvgIcon type={goal.icon} />
                  </Card>
                </div>
              ))}
            </Stack>
          </div>

          {showOtherGoal ? <OtherGoalField setOtherGoal={setOtherGoal} /> : null}
        </DialogContent>
        <Stack distribution="spaceBetween" direction="horizontal">
          <DashboardButton kind="ghost" size="xl" className={locals.actionButton} onClick={skipHandler}>
            {t('in-plg:userGoalSelectionDialog.skip')}
          </DashboardButton>

          <DashboardButton
            disabled={!selectedGoals.length}
            kind="primary"
            size="xl"
            className={locals.actionButton}
            onClick={() => {
              submitHandler(selectedGoals, otherGoal);
            }}
          >
            {t('in-plg:userGoalSelectionDialog.done')}
          </DashboardButton>
        </Stack>
      </div>
    </Dialog>
  );
};

export default UserGoalSelectionDialog;

function submitHandler(selectedGoals: UserGoal[], otherGoal: string) {
  selectedGoals.forEach(goal => {
    if (goal.type == TOGGLER) {
      if (!otherGoal) return;
      segmentTrackingFunc(`User goal: Other goal`, CTA_CLICKED, otherGoal);
      return;
    }
    segmentTrackingFunc(`User goal: ${goal.text}`, CTA_CLICKED);
  });
  close();
}

function goalSetHandler(
  checked: boolean,
  goal: UserGoal,
  setShowOtherGoal: Dispatch<SetStateAction<boolean>>,
  setOtherGoal: Dispatch<SetStateAction<string>>,
  setSelectedGoals: Dispatch<SetStateAction<UserGoal[]>>
) {
  if (goal.type == TOGGLER) {
    setShowOtherGoal((prev: boolean) => !prev);
    setOtherGoal('');
  }
  setSelectedGoals((prevSelectedGoals: any) => {
    if (checked) {
      return [...prevSelectedGoals, goal];
    } else {
      return prevSelectedGoals.filter((preGoal: UserGoal) => preGoal.id !== goal.id);
    }
  });
}

function skipHandler() {
  segmentTrackingFunc(GOAL_SELECTION.SEGMENT_MESSAGE.SKIP, CTA_CLICKED);
  close();
}

function closeHandler() {
  segmentTrackingFunc(GOAL_SELECTION.SEGMENT_MESSAGE.CLOSE, CTA_CLICKED);
  close();
}
