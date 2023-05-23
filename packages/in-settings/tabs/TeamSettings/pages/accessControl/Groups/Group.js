/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { SvgIcon, Button, Toggle } from '@instana/components';
import { just } from '@instana/observables';

import {
  productAreaPermissions,
  productPermissions,
  productRestrictions,
  productOwnerPermissions,
  AreaPermission,
  RESTRICTED_ACCESS
} from 'in-stores/permission';
import RoleAndAccessScopeColumns from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import {
  getGroupWithIdpFlagAsResultObservable,
  saveGroup,
  createNewGroup
} from 'in-settings/tabs/TeamSettings/api/groups';
import PermissionsList from 'in-settings/tabs/TeamSettings/pages/accessControl/Permissions/PermissionsList.js';
import { types } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/permissionSetResultFilter';
import { createForm } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import LoadingGroup from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/LoadingGroup';
import Areas from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/Areas';
import InlineEditorRow from 'in-settings/tabs/TeamSettings/components/InlineEditorRow';
import Users from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/Users';
import { teamSettingsAccessControlGroups } from 'in-settings/navigation/paths';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { refresh } from 'in-settings/tabs/TeamSettings/api/groups';
import { success as successResult } from 'in-services/util/result';
import { rbacImprovementEnabled } from 'in-services/featureFlags';
import { getEntityHref } from 'in-settings/navigation/paths';
import ApiItemView from 'in-settings/components/ApiItemView';
import { ownerRoleId, defaultRoleId } from 'in-stores/user';
import IconLabel from 'in-alerting/components/IconLabel';
import FormGroup from 'in-settings/components/FormGroup';
import { RemoveUserDialog } from './RemoveUserDialog';
import { Row, Col } from 'in-components/layout/Grid';
import Dialog from 'in-components/Dialog/Dialog';
import { noop } from 'in-services/fixedObjects';
import Title from 'in-components/Title/Title';
import Label from 'in-components/form/Label';
import Pill from 'in-components/Pill';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './Group.mless';

const permissionsForList = productPermissions.filter(permission => !permission.isOwnerPermission);

export default function Group({ match }) {
  const [groupId, setGroupId] = useState(match.params.id);
  const { navigate, goToPath } = useNavigation();

  function updateGroupId(id) {
    setGroupId(id);

    // Update URL path to replace 'new' with actual new group id (will not cause a page reload)
    navigate(getEntityHref(teamSettingsAccessControlGroups, id), true);
  }

  return (
    <>
      <Title title={t('in-settings:tabs.group')} />
      <ApiItemView
        parentViewName={t('in-settings:tabs.groups')}
        parentPath={teamSettingsAccessControlGroups}
        getObservables={() => ({
          group: groupId ? getGroupWithIdpFlagAsResultObservable(groupId) : just(successResult(createNewGroup()))
        })}
        enrichForm={createForm}
        saveItem={saveItem}
        onCancelClick={() => {
          goToPath(teamSettingsAccessControlGroups);
        }}
        renderLoadingState={renderLoadingState}
        hideFooter={rbacImprovementEnabled}
        render={renderGroup}
        // additional props which are passed down
        groupId={groupId}
        updateGroupId={updateGroupId}
      />
    </>
  );
}

function renderLoadingState() {
  return <LoadingGroup />;
}

function renderGroup(props) {
  const { setForm, form, group, setMessage, updateGroupId } = props;
  const isOwnerGroup = group.id === ownerRoleId;
  const isSystemGroup = isOwnerGroup || group.id === defaultRoleId;
  const isExistingGroup = !!group.id;

  const accessRestrictionWarning = needsToShowRestricAccessedWarning(form.get('permissionSet').value) ? (
    <div className="message message-small message-warning">
      <IconLabel
        noBottomMargin
        text={t('in-stores:permissionRestrictedWarning')}
        color="var(--colors-semantic-warning-dark)"
        type="lib_help_error_warning_outline"
      />
    </div>
  ) : null;
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

      if (rbacImprovementEnabled) {
        // Trigger refresh group observable (including group members)
        refresh();
      }
    };
    if (rbacImprovementEnabled) {
      addActiveDialog(
        <RemoveUserDialog
          userId={id}
          groupId={group.id}
          username={name}
          removeLocally={() => removeUserLocally(false)}
        />
      );
    } else {
      removeUserLocally(true);
    }
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
        {rbacImprovementEnabled && (
          <RoleAndAccessScopeColumns
            form={form}
            setForm={setForm}
            readOnly={isOwnerGroup}
            editMode={isExistingGroup}
            onSave={form => saveItem({ form, setMessage, setCanSaveItem: noop, setForm, updateGroupId })}
          />
        )}
        {!rbacImprovementEnabled &&
          form.get('permissionSet').map(field => (
            <Col lg={6}>
              <Areas
                permissionSet={field.value}
                update={(ids, dfq) => update(ids, dfq, form, setForm)}
                removeId={(id, propertyName) => removeId(id, propertyName, form, setForm)}
                removeDfq={() => removeDfq(form, setForm)}
                readOnly={isOwnerGroup}
              />
            </Col>
          ))}
      </Row>

      {!rbacImprovementEnabled && (
        <>
          <Row>
            <Col lg>
              {form.get('permissionSet').map(field => (
                <FormGroup>
                  <Label>{t('in-settings:tabs.access')}</Label>
                  {productRestrictions.map(({ value, label, help }) => (
                    <HorizontalFormGroup key={label} helpText={help}>
                      <Label htmlFor={`permission-${value}`}>{label}</Label>
                      <Toggle
                        id={`permission-${value}`}
                        checked={field.value.permissions.includes(value)}
                        onChange={() => togglePermission(form, setForm, value)}
                        disabled={isOwnerGroup}
                      />
                    </HorizontalFormGroup>
                  ))}
                </FormGroup>
              ))}
            </Col>
          </Row>

          <Row>
            <Col lg>
              {form.get('permissionSet').map(field => (
                <FormGroup>
                  <Label>{t('in-settings:tabs.permissionScope')}</Label>
                  {accessRestrictionWarning}
                  {productAreaPermissions.map(({ value, label, isNew }) => (
                    <HorizontalFormGroup
                      key={label}
                      helpText={t('in-settings:tabs.permitsAccessToLabelMonitoringFunctionality', { label: label })}
                    >
                      <span>
                        <Label htmlFor={`permission-${value}`}>{label}</Label>
                        {isNew && (
                          <Pill kind="inverted" color={theme.lib.colors.blue800}>
                            {t('in-stores:permissionNewLabel')}
                          </Pill>
                        )}
                      </span>
                      <Toggle
                        id={`permission-${value}`}
                        checked={field.value.permissions.includes(value)}
                        onChange={() => togglePermission(form, setForm, value)}
                        disabled={isOwnerGroup}
                      />
                    </HorizontalFormGroup>
                  ))}
                </FormGroup>
              ))}
            </Col>
          </Row>

          <Row>
            <Col lg>
              {form.get('permissionSet').map(field => (
                <FormGroup>
                  <Label>{t('in-settings:tabs.ownerPermissions')}</Label>
                  {productOwnerPermissions.map(({ value, label, description, keyForGroupApi }) => (
                    <HorizontalFormGroup key={label} helpText={description}>
                      <Label htmlFor={`permission-${value}`}>{label}</Label>
                      <Toggle
                        id={`permission-${keyForGroupApi}`}
                        checked={field.value.permissions.includes(keyForGroupApi)}
                        onChange={() => {
                          // check if value is currently false -> user sets permission to true
                          if (!field.value.permissions.includes(keyForGroupApi)) {
                            addActiveDialog(
                              <ConfirmationDialog
                                togglePermission={() => togglePermission(form, setForm, keyForGroupApi)}
                              />
                            );
                          } else {
                            togglePermission(form, setForm, keyForGroupApi);
                          }
                        }}
                        disabled={isOwnerGroup}
                      />
                    </HorizontalFormGroup>
                  ))}
                </FormGroup>
              ))}
            </Col>
          </Row>

          <Row>
            <Col lg>
              {form.get('permissionSet').map(field => (
                <PermissionsList
                  permissions={permissionsForList}
                  listActions={[
                    {
                      id: 'toggleEnabledAction',
                      sortable: false,
                      width: '5rem',
                      widthInAbsoluteUnit: true,
                      getContent(entity) {
                        return (
                          <Toggle
                            id={`permission-${entity.keyForGroupApi}`}
                            checked={field.value.permissions.includes(entity.keyForGroupApi)}
                            onChange={() => togglePermission(form, setForm, entity.keyForGroupApi)}
                            disabled={isOwnerGroup}
                          />
                        );
                      }
                    }
                  ]}
                />
              ))}
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export function needsToShowRestricAccessedWarning(permissionSet) {
  return hasScopes(permissionSet) && !permissionSet.permissions?.includes(RESTRICTED_ACCESS);
}

function hasScopes(permissionSet) {
  return (
    permissionSet.permissions?.includes(AreaPermission.ACCESS_APPLICATIONS) ||
    permissionSet.permissions?.includes(AreaPermission.ACCESS_KUBERNETES) ||
    permissionSet.permissions?.includes(AreaPermission.ACCESS_WEBSITES) ||
    permissionSet.permissions?.includes(AreaPermission.ACCESS_MOBILE_APPS)
  );
}

function ConfirmationDialog({ togglePermission }) {
  return (
    <Dialog
      className={locals.confirmationDialog}
      title={t('in-settings:tabs.ownerPermissions')}
      doNotCloseOnOutsideClick
      onClose={close}
    >
      <p>{t('in-settings:tabs.youAreAssigningThisGroupOwnerPermissions')}</p>

      <Button
        kind="primary"
        className={locals.confirmationDialogButton}
        onClick={() => {
          togglePermission();
          close();
        }}
      >
        Yes, I understand
      </Button>
    </Dialog>
  );
}

function togglePermission(form, setForm, value) {
  const modifiedPermissionSet = copyPermissionSet(form);
  modifiedPermissionSet.permissions = modifiedPermissionSet.permissions.includes(value)
    ? modifiedPermissionSet.permissions.filter(v => v !== value)
    : [...modifiedPermissionSet.permissions, value];
  setForm(form.updateIn(['permissionSet'], f => f.setValue(modifiedPermissionSet).setTouched(true)));
}

function update(ids, infraDfqFilterString, form, setForm) {
  const modifiedPermissionSet = copyPermissionSet(form);

  modifiedPermissionSet.applicationIds = mapToScopeBindings(
    ids.filter(item => item.type === types.APPLICATION).map(mapToId),
    modifiedPermissionSet.applicationIds
  );
  modifiedPermissionSet.kubernetesClusterUUIDs = mapToScopeBindings(
    ids.filter(item => item.type === types.K8S_CLUSTER).map(mapToId),
    modifiedPermissionSet.kubernetesClusterUUIDs
  );
  modifiedPermissionSet.kubernetesNamespaceUIDs = mapToScopeBindings(
    ids.filter(item => item.type === types.K8S_NAMESPACE).map(mapToId),
    modifiedPermissionSet.kubernetesNamespaceUIDs
  );
  modifiedPermissionSet.websiteIds = mapToScopeBindings(
    ids.filter(item => item.type === types.WEBSITE).map(mapToId),
    modifiedPermissionSet.websiteIds
  );
  modifiedPermissionSet.mobileAppIds = mapToScopeBindings(
    ids.filter(item => item.type === types.MOBILE_APP).map(mapToId),
    modifiedPermissionSet.mobileAppIds
  );

  modifiedPermissionSet.infraDfqFilter = {
    scopeId: infraDfqFilterString,
    scopeRoleId: modifiedPermissionSet.infraDfqFilter.scopeRoleId
  };

  setForm(form.updateIn(['permissionSet'], f => f.setValue(modifiedPermissionSet).setTouched(true)));
}

function mapToId(item) {
  return item.id;
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

function removeId(id, propertyName, form, setForm) {
  const modifiedPermissionSet = copyPermissionSet(form);
  modifiedPermissionSet[propertyName] = modifiedPermissionSet[propertyName].filter(({ scopeId }) => scopeId !== id);
  setForm(form.updateIn(['permissionSet'], f => f.setValue(modifiedPermissionSet).setTouched(true)));
}

function removeDfq(form, setForm) {
  const modifiedPermissionSet = copyPermissionSet(form);
  modifiedPermissionSet.infraDfqFilter = {
    scopeId: '',
    scopeRoleId: '-1'
  };
  setForm(form.updateIn(['permissionSet'], f => f.setValue(modifiedPermissionSet).setTouched(true)));
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
  if (rbacImprovementEnabled) {
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
}

function copyPermissionSet(form) {
  return { ...form.get('permissionSet').value };
}

function changeGroupName(form, updateForm, setMessage, updateGroupId) {
  if (!form.hierarchyValid) {
    return updateForm(form.setTouched(true, { recurse: true }));
  }

  saveItem({ form, setMessage, setCanSaveItem: noop, setForm: updateForm, updateGroupId });
}

function saveItem({ form, setMessage, setCanSaveItem, setForm, updateGroupId = noop }) {
  const group = {
    id: form.get('id').value,
    name: form.get('name').value,
    members: form.get('members').value,
    permissionSet: form.get('permissionSet').value
  };

  setMessage({ text: t('in-settings:tabs.savingGroup'), type: 'neutral', isSaving: true });

  saveGroup(group).once(
    savedGroup => {
      setMessage({ text: t('in-settings:tabs.groupSuccessfullySaved'), type: 'success' });
      setForm(form.updateIn(['id'], f => f.setValue(savedGroup.id)));
      setCanSaveItem(false);

      if (group.id !== savedGroup.id) {
        updateGroupId(savedGroup.id);
      }
    },
    error => {
      setMessage({ text: t('in-settings:tabs.failedToSaveGroup', { err: error.message }), type: 'error' });
    }
  );
}
