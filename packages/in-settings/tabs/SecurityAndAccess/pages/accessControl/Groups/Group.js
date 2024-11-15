/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { SvgIcon } from '@instana/components';
import { just } from '@instana/observables';

import RoleAndAccessScopeColumns from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import { removeAdditionalPermissionsForNoaccess } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import {
  getGroupWithIdpFlagAsResultObservable,
  saveGroup,
  createNewGroup
} from 'in-settings/tabs/SecurityAndAccess/api/groups';
import { ProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { RemoveUserDialog } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/RemoveUserDialog';
import { createForm } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import LoadingGroup from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/LoadingGroup';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import InlineEditorRow from 'in-settings/tabs/SecurityAndAccess/components/InlineEditorRow';
import Users from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/Users';
import { securityAndAccessAccessControlGroups } from 'in-settings/navigation/paths';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { CREATED_OBJECT, UPDATED_OBJECT } from 'in-services/util/constants';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { refresh } from 'in-settings/tabs/SecurityAndAccess/api/groups';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { success as successResult } from 'in-services/util/result';
import { getEntityHref } from 'in-settings/navigation/paths';
import ApiItemView from 'in-settings/components/ApiItemView';
import { ownerRoleId, defaultRoleId } from 'in-stores/user';
import { Row, Col } from 'in-components/layout/Grid';
import { noop } from 'in-services/fixedObjects';
import Title from 'in-components/Title/Title';
import { t } from 'in-i18n';

import locals from './Group.mless';

export default function Group({ match }) {
  const [groupId, setGroupId] = useState(match.params.id);
  const { navigate, goToPath } = useNavigation();
  const { unstable_trackEvent } = useSegmentTracking();

  function updateGroupId(id) {
    setGroupId(id);

    // Update URL path to replace 'new' with actual new group id (will not cause a page reload)
    navigate(getEntityHref(securityAndAccessAccessControlGroups, id), true);
  }
  return (
    <>
      <Title title={t('in-settings:tabs.group')} />
      <ApiItemView
        parentViewName={t('in-settings:tabs.groups')}
        parentPath={securityAndAccessAccessControlGroups}
        getObservables={() => ({
          group: groupId ? getGroupWithIdpFlagAsResultObservable(groupId) : just(successResult(createNewGroup()))
        })}
        enrichForm={createForm}
        saveItem={saveItem}
        onCancelClick={() => {
          goToPath(securityAndAccessAccessControlGroups);
        }}
        renderLoadingState={renderLoadingState}
        hideFooter
        render={renderGroup}
        // additional props which are passed down
        groupId={groupId}
        updateGroupId={updateGroupId}
        unstable_trackEvent={unstable_trackEvent}
      />
    </>
  );
}

function renderLoadingState() {
  return <LoadingGroup />;
}

const trackGroupUpdate = (unstable_trackEvent, isExistingGroup, group) => {
  const permissionSet = group.permissionSet;
  const groupObject = {
    groupId: group.id,
    permissions: permissionSet.permissions,
    applicationsCount: permissionSet.applicationIds.length,
    websitesCount: permissionSet.websiteIds.length,
    mobileAppsCount: permissionSet.mobileAppIds.length,
    businessPerspectivesCount: permissionSet.businessPerspectiveIds.length,
    syntheticTestsCount: permissionSet.syntheticTestIds.length,
    syntheticCredentialsCount: permissionSet.syntheticCredentialKeys.length,
    kubernetesClusterUUIDsCount: permissionSet.kubernetesClusterUUIDs.length,
    kubernetesNamespaceUIDsCount: permissionSet.kubernetesNamespaceUIDs.length
  };

  if (isExistingGroup) {
    unstable_trackEvent(UPDATED_OBJECT, { objectType: 'settings.accessControl.updateGroup' }, groupObject);
  } else {
    unstable_trackEvent(CREATED_OBJECT, { objectType: 'settings.accessControl.createGroup' }, groupObject);
  }
};

function renderGroup(props) {
  const { setForm, form, group, setMessage, updateGroupId, result, unstable_trackEvent } = props;
  const isOwnerGroup = group.id === ownerRoleId;
  const isSystemGroup = isOwnerGroup || group.id === defaultRoleId;
  const isExistingGroup = !!group.id;

  const removeUserFromGroup = (id, name) => {
    const removeUserLocally = touched => {
      const members = form
        .get('members')
        .value.slice()
        .filter(member => member.userId !== id);
      if (touched) {
        setForm(form.updateIn(['members'], f => f.setValue(members).setTouched(true)));
      } else {
        setForm(form.updateIn(['members'], f => f.setValue(members)));
        setMessage({ text: t('in-settings:tabs.successfullyRemovedUserFromGroup', { name }), type: 'success' });
      }

      // Trigger refresh group observable (including group members)
      refresh();
    };

    addActiveDialog(
      <RemoveUserDialog userId={id} groupId={group.id} username={name} removeLocally={() => removeUserLocally(false)} />
    );
  };
  return (
    <>
      <InlineEditorRow
        canEdit={!isSystemGroup}
        label={group.name}
        avatar={<SvgIcon className={locals.icon} type="lib_alerts_user_impacted" size="l" />}
        inputValue={form.get('name').value}
        onInputChange={value => setForm(form.updateIn(['name'], f => f.setValue(value).setTouched(true)))}
        hasError={!form.get('name').valid && form.get('name').touched}
        onClickSave={() => changeGroupName(form, setForm, setMessage, updateGroupId)}
        onClickCancel={() => setForm(form.updateIn(['name'], f => f.setValue(group.name).setTouched(false)))}
      />

      <Row>
        <Col lg={6}>
          <Users
            members={form.get('members').value}
            removeUser={removeUserFromGroup}
            groupId={group.id}
            addUsers={users => addUsers(users, form, setForm, setMessage)}
            noDelete={isOwnerGroup && form.get('members').value.length <= 2}
          />
        </Col>
        <RoleAndAccessScopeColumns
          form={form}
          setForm={setForm}
          readOnly={isOwnerGroup}
          editMode={isExistingGroup}
          onSave={form =>
            saveItem({ form, setMessage, setCanSaveItem: noop, setForm, updateGroupId, unstable_trackEvent })
          }
          result={result}
        />
      </Row>
    </>
  );
}

export function mapToScopeBindings(currentIds, currentScopes) {
  // keep entries which are still listed, remove the rest
  currentScopes = currentScopes.filter(({ scopeId }) => currentIds.indexOf(scopeId) >= 0);

  // add all other ids with a default role
  const lookUpIds = new Set(currentScopes.map(({ scopeId }) => scopeId));
  currentScopes = [
    ...currentScopes,
    ...currentIds.filter(id => !lookUpIds.has(id)).map(scopeId => ({ scopeId, scopeRoleId: '-1' }))
  ];

  return currentScopes;
}

function addUsers(users, form, setForm, setMessage) {
  setForm(
    form.updateIn(['members'], f =>
      f
        .setValue([
          ...form.get('members').value,
          ...users.map(({ id, email }) => ({ userId: id, email, joinedViaIdpMapping: false }))
        ])
        .setTouched(true)
    )
  );

  let text;
  if (users.length === 1) {
    const name = users[0].fullName;
    text = t('in-settings:tabs.successfullyAddedUserToGroup', { name });
  } else {
    text = t('in-settings:tabs.successfullyAddedUsersToGroup');
  }
  setMessage({ text, type: 'success' });

  // Trigger refresh group observable (including group members)
  refresh();
}

function changeGroupName(form, updateForm, setMessage, updateGroupId) {
  if (!form.hierarchyValid) {
    return updateForm(form.setTouched(true, { recurse: true }));
  }

  saveItem({ form, setMessage, setCanSaveItem: noop, setForm: updateForm, updateGroupId });
}

function getPermissionSetWithApFilters(permissionSet, form) {
  const backendModel = toBackendQueryModel(form.get('tagFilterExpression').value, true);
  const contributionFilterConfig = {
    tagFilterExpression: backendModel,
    scope: form.get('scope')?.value,
    label: form.get('label')?.value?.trim()
  };
  const permissionSetWithFilter = {
    ...permissionSet,
    ['restrictedApplicationFilter']: contributionFilterConfig
  };
  return permissionSetWithFilter;
}

function saveItem({ form, setMessage, setCanSaveItem, setForm, updateGroupId = noop, unstable_trackEvent }) {
  const isRestrictedFilter = form.get('tagFilterExpression').value?.length > 0;
  let permissionSet = form.get('permissionSet').value;
  if (!form.hierarchyValid) {
    setForm(form.setTouched(true, { recurse: true }));
    setCanSaveItem(false);
    return;
  }

  const actionFilter = form.get('actionFilter').value;
  permissionSet = {
    ...permissionSet,
    actionFilter
  };
  permissionSet = removeAdditionalPermissionsForNoaccess(
    [
      ProductArea.WEBSITE,
      ProductArea.MOBILE_APP,
      ProductArea.APPLICATION,
      ProductArea.INFRASTRUCTURE,
      ProductArea.SYNTHETICS,
      ProductArea.AUTOMATION
    ],
    permissionSet
  );

  const group = {
    id: form.get('id').value,
    name: form.get('name').value,
    members: form.get('members').value,
    permissionSet: isRestrictedFilter ? getPermissionSetWithApFilters(permissionSet, form) : permissionSet
  };

  setMessage({ text: t('in-settings:tabs.savingGroup'), type: 'neutral', isSaving: true });

  saveGroup(group).once(
    savedGroup => {
      setMessage({ text: t('in-settings:tabs.groupSuccessfullySaved'), type: 'success' });
      setForm(form.updateIn(['id'], f => f.setValue(savedGroup.id)));
      setCanSaveItem(false);
      trackGroupUpdate(unstable_trackEvent, group.id === savedGroup.id, savedGroup);
      if (group.id !== savedGroup.id) {
        updateGroupId(savedGroup.id);
      }
    },
    error => {
      setMessage({ text: t('in-settings:tabs.failedToSaveGroup', { err: error.message }), type: 'error' });
    }
  );
}
