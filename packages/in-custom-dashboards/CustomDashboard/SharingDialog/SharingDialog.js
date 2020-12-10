import React, { useState } from 'react';

import SharingDialogPresenter from 'in-custom-dashboards/CustomDashboard/SharingDialog/SharingDialogPresenter';
import { close } from 'in-components/DialogPresenter/store';
import { getUsers } from 'in-custom-dashboards/api';
import { deepCopy } from 'in-services/util/object';
import useObservable from 'in-hooks/useObservable';
import { user } from 'in-stores/user';

export default function SharingDialog({ config, onSubmit }) {
  const usersResult = useObservable(getUsers, []);
  const [{ accessRules, selectedUserId }, setState] = useState(() => ({
    accessRules: config.accessRules,
    selectedUserId: ''
  }));

  return (
    <SharingDialogPresenter
      accessRules={accessRules}
      selectedUserId={selectedUserId}
      usersResult={usersResult}
      isPrivate={isPrivate(accessRules)}
      setPrivate={prvt => setPrivate(prvt, accessRules, setState)}
      setSelectedUserId={selectedUserId => setState({ selectedUserId, accessRules })}
      addEditor={() => addEditor(accessRules, setState, selectedUserId)}
      removeEditor={userId => removeEditor(accessRules, setState, userId)}
      isUsingAdvancedAccessRules={isUsingAdvancedAccessRules(accessRules)}
      onSubmit={e => {
        e.preventDefault();
        close();
        onSubmit(accessRules);
      }}
    />
  );
}

function isPrivate(accessRules) {
  return !accessRules.some(({ relationType }) => relationType === 'GLOBAL');
}

function setPrivate(prvt, accessRules, setState) {
  accessRules = deepCopy(accessRules);

  if (prvt) {
    // Remove everything but this user's access
    accessRules = accessRules.filter(({ relatedId, relationType }) => relatedId === user.id && relationType === 'USER');
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

function addEditor(accessRules, setState, selectedUserId) {
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

function removeEditor(accessRules, setState, userId) {
  setState({
    accessRules: accessRules.filter(({ relationType, relatedId }) => relationType !== 'USER' || relatedId !== userId)
  });
}

// This dialog only supports editing of a subset of the access rules possible in the backend.
// Everything that this dialog cannot support is considered "advanced". This may be revisited
// in the future with more RBAC investment.
function isUsingAdvancedAccessRules(accessRules) {
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
