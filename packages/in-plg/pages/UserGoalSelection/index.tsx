/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error
import UserGoalSelectionDialog from 'promise-loader?global,usergoalselectiondialog!in-plg/pages/UserGoalSelection/Dialog';
import React, { useEffect } from 'react';

import { useObservable } from '@instana/hooks';

//@ts-expect-error missing typescript migration
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import useGetAccountActivation from 'in-plg/pages/WelcomePage/widgets/hooks/useGetAccountActivation';
import { AccountActivation, UsageInfo } from 'in-plg/pages/UserGoalSelection/types';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { USER_LICENSE_TYPES } from 'in-plg/utils/constants';
import getUsageInfo from 'in-subscription/getUsageInfo';

const { SELF_SERVICE, QUOTA } = USER_LICENSE_TYPES;
const DeferredUserGoalSelectionDialog = createAsyncViewComponent(UserGoalSelectionDialog);

const UserGoalSelection = () => {
  const userActiovation: AccountActivation | undefined = useGetAccountActivation();
  const { activeLicenseType }: UsageInfo = useObservable(getUsageInfo, []) ?? {};
  const isTrial = [SELF_SERVICE, QUOTA].includes(activeLicenseType ?? '');
  let isFirstLogin: boolean = true;

  if (userActiovation) {
    const key = Object.keys(userActiovation)[0];
    isFirstLogin = userActiovation[key]?.fs.status;
  }

  useEffect(() => {
    if (!isFirstLogin && isTrial) addActiveDialog(<DeferredUserGoalSelectionDialog />);
  }, [isFirstLogin, isTrial]);

  return null;
};

export default UserGoalSelection;
