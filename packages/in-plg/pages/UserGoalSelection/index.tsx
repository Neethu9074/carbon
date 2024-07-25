/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error
import UserGoalSelectionDialog from 'promise-loader?global,usergoalselectiondialog!in-plg/pages/UserGoalSelection/UserGoalSelectionDialog';
import React, { useEffect, useState } from 'react';

import { useObservable } from '@instana/hooks';

//@ts-expect-error missing typescript migration
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import useGetAccountActivation from 'in-plg/pages/WelcomePage/widgets/hooks/useGetAccountActivation';
import { AccountActivation, UsageInfo } from 'in-plg/pages/UserGoalSelection/types';
import { GOAL_SELECTION_FALSE, SHOW_GOAL_SELECTION } from './utils/consts';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { USER_LICENSE_TYPES } from 'in-plg/utils/constants';
import getUsageInfo from 'in-subscription/getUsageInfo';

const { SELF_SERVICE, QUOTA } = USER_LICENSE_TYPES;
const DeferredUserGoalSelectionDialog = createAsyncViewComponent(UserGoalSelectionDialog);

const UserGoalSelection = () => {
  const userActivation: AccountActivation | undefined = useGetAccountActivation();
  const [showGoalSelection, setShowGoalSelection] = useState<boolean>(false);
  const { activeLicenseType }: UsageInfo = useObservable(getUsageInfo, []) ?? {};
  const isTrial = [SELF_SERVICE, QUOTA].includes(activeLicenseType ?? '');
  let isFirstLogin: boolean = true;

  if (userActivation) {
    const firstKey = Object.keys(userActivation)[0];
    isFirstLogin = userActivation[firstKey]?.fs.status;
  }

  useEffect(() => {
    if (!isFirstLogin && isTrial) {
      const showGoalSelection = localStorage.getItem(SHOW_GOAL_SELECTION) === GOAL_SELECTION_FALSE ? false : true;
      if (showGoalSelection) setShowGoalSelection(showGoalSelection);
    }
  }, [isFirstLogin, isTrial]);

  useEffect(() => {
    if (showGoalSelection) {
      localStorage.setItem(SHOW_GOAL_SELECTION, GOAL_SELECTION_FALSE);
      addActiveDialog(<DeferredUserGoalSelectionDialog />);
    }
  }, [showGoalSelection]);

  return null;
};

export default UserGoalSelection;
