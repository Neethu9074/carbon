/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error
import UserGoalSelectionDialog from 'promise-loader?global,usergoalselectiondialog!in-plg/pages/UserGoalSelection/UserGoalSelectionDialog';
import React, { useEffect } from 'react';

import { useObservable } from '@instana/hooks';

//@ts-expect-error missing typescript migration
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { ExtendedUserSettings, UsageInfo } from 'in-plg/pages/UserGoalSelection/types';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { USER_LICENSE_TYPES } from 'in-plg/utils/constants';
import getUsageInfo from 'in-subscription/getUsageInfo';

const { SELF_SERVICE, QUOTA } = USER_LICENSE_TYPES;
const DeferredUserGoalSelectionDialog = createAsyncViewComponent(UserGoalSelectionDialog);

const UserGoalSelection = () => {
  const userSettings: ExtendedUserSettings = window.instana.termsAndPrivacySettings;
  const { activeLicenseType }: UsageInfo = useObservable(getUsageInfo, []) ?? {};
  const isTrial = [SELF_SERVICE, QUOTA].includes(activeLicenseType ?? '');
  const enableUserGoalSelection = userSettings?.showUserGoalSelection && isTrial;

  useEffect(() => {
    if (enableUserGoalSelection) {
      addActiveDialog(<DeferredUserGoalSelectionDialog />);
    }
  }, [enableUserGoalSelection]);

  return null;
};

export default UserGoalSelection;
