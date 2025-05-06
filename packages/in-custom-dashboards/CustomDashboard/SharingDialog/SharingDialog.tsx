/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';

import { AccessRule, CustomDashboardWithUserSpecificInformation } from '@instana/types';
import { useObservable } from '@instana/hooks';

import SharingDialogPresenter from 'in-custom-dashboards/CustomDashboard/SharingDialog/SharingDialogPresenter';
import { close } from 'in-components/DialogPresenter/store';
import { getUsers } from 'in-custom-dashboards/api';
import { deepCopy } from 'in-services/util/object';
import { user } from 'in-stores/user';

interface SharingDialogProps {
  config: CustomDashboardWithUserSpecificInformation;
  onSubmit: (accessRules: AccessRule[]) => void;
}

interface UserState {
  accessRules: AccessRule[];
  selectedUserId: string;
}

export default function SharingDialog({ config, onSubmit }: SharingDialogProps) {
  const usersResult = useObservable(getUsers(), []);
  const [{ accessRules, selectedUserId }, setState] = useState<UserState>(() => ({
    accessRules: config.accessRules,
    selectedUserId: ''
  }));

  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    if (!accessRules || !config.accessRules) return;

    const valueChanged = accessRules.toString() !== config.accessRules.toString();

    if (!changesMade && valueChanged) {
      setChangesMade(true);
    } else if (changesMade && !valueChanged) {
      setChangesMade(false);
    }
  }, [accessRules, config.accessRules, changesMade]);

  return (
    <SharingDialogPresenter
      accessRules={accessRules}
      selectedUserId={selectedUserId}
      usersResult={usersResult}
      //@ts-expect-error user has no id in defintion, should definitely change this
      userIsDashboardOwner={user?.id === config.ownerId}
      isPrivate={isPrivate(accessRules)}
      setPrivate={prvt => setPrivate(prvt, accessRules, setState)}
      setSelectedUserId={(selectedUserId: string) => setState({ selectedUserId, accessRules })}
      addEditor={() => addEditor(accessRules, setState, selectedUserId)}
      removeEditor={(userId: string) => removeEditor(accessRules, setState, userId, selectedUserId)}
      isUsingAdvancedAccessRules={isUsingAdvancedAccessRules(accessRules)}
      onSubmit={e => {
        e.preventDefault();
        close();
        onSubmit(accessRules);
      }}
      changesMade={changesMade}
    />
  );
}

function isPrivate(accessRules: AccessRule[]) {
  return !accessRules.some(({ relationType }) => relationType === 'GLOBAL');
}

function setPrivate(
  prvt: boolean,
  accessRules: AccessRule[],
  setState: React.Dispatch<React.SetStateAction<UserState>>
) {
  accessRules = deepCopy(accessRules);

  if (prvt) {
    // Remove everything but this user's access
    accessRules = accessRules.filter(
      //@ts-expect-error user has no id in defintion, should definitely change this
      ({ relatedId, relationType }) => relatedId === user?.id && relationType === 'USER'
    );
  } else {
    accessRules.push({
      accessType: 'READ',
      relationType: 'GLOBAL',
      relatedId: ''
    });
  }

  setState({
    accessRules,
    selectedUserId: ''
  });
}

function addEditor(
  accessRules: AccessRule[],
  setState: React.Dispatch<React.SetStateAction<UserState>>,
  selectedUserId: string
) {
  accessRules = deepCopy(accessRules);

  accessRules.push({
    accessType: 'READ_WRITE',
    relationType: 'USER',
    relatedId: selectedUserId
  });

  setState({
    accessRules,
    selectedUserId: ''
  });
}

function removeEditor(
  accessRules: AccessRule[],
  setState: React.Dispatch<React.SetStateAction<UserState>>,
  userId: string,
  selectedUserId: string
) {
  setState({
    accessRules: accessRules.filter(({ relationType, relatedId }) => relationType !== 'USER' || relatedId !== userId),
    selectedUserId
  });
}

// This dialog only supports editing of a subset of the access rules possible in the backend.
// Everything that this dialog cannot support is considered "advanced". This may be revisited
// in the future with more RBAC investment.
function isUsingAdvancedAccessRules(accessRules: AccessRule[]) {
  for (const accessRule of accessRules) {
    const isUserAccessRuleAsSupportedByThisDialog =
      accessRule.relationType === 'USER' && accessRule.accessType === 'READ_WRITE';
    const isGlobalAccessRuleAsSupportedByThisDialog =
      accessRule.relationType === 'GLOBAL' && accessRule.accessType === 'READ';
    if (!isUserAccessRuleAsSupportedByThisDialog && !isGlobalAccessRuleAsSupportedByThisDialog) {
      return true;
    }
  }

  return false;
}
