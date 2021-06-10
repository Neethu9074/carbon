/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';
import { just } from '@instana/observables';

import {
  productAreaPermissions,
  productPermissions,
  productRestrictions,
  productOwnerPermissions
} from 'in-stores/permission';
import { getGroupAsResultObservable, saveGroup, createNewGroup } from 'in-settings/tabs/TeamSettings/api/groups';
import PermissionsList from 'in-settings/tabs/TeamSettings/pages/accessControl/Permissions/PermissionsList.js';
import { types } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/permissionSetResultFilter';
import LoadingGroup from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/LoadingGroup';
import Areas from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/Areas';
import { success, neutral, error as errorType } from 'in-components/Message/types';
import Users from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/Users';
import { teamSettingsAccessControlGroups } from 'in-settings/navigation/paths';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import { success as successResult } from 'in-services/util/result';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import ApiItemView from 'in-settings/components/ApiItemView';
import { ownerRoleId, defaultRoleId } from 'in-stores/user';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-components/layout/Grid';
import Dialog from 'in-components/Dialog/Dialog';
import { goToPath } from 'in-stores/navigation';
import Toggle from 'in-components/form/Toggle';
import Title from 'in-components/Title/Title';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from './Group.mless';

const permissionsForList = productPermissions.filter(permission => !permission.isOwnerPermission);

export default function Group({ match }) {
  const groupId = match.params.id;
  return (
    <>
      <Title title={t('in-settings:tabs.group')} />
      <ApiItemView
        parentViewName={t('in-settings:tabs.groups')}
        parentPath={teamSettingsAccessControlGroups}
        getObservables={() => ({
          group: groupId ? getGroupAsResultObservable(groupId) : just(successResult(createNewGroup()))
        })}
        enrichForm={enrichForm}
        saveItem={saveItem}
        onCancelClick={() => goToPath(teamSettingsAccessControlGroups)}
        renderLoadingState={renderLoadingState}
        render={renderGroup}
        // additional props which are passed down
        groupId={groupId}
      />
    </>
  );
}

function renderLoadingState() {
  return <LoadingGroup />;
}

function renderGroup(props) {
  const { setForm, form, group } = props;
  const isOwnerGroup = group.id === ownerRoleId;
  const isSystemGroup = isOwnerGroup || group.id === defaultRoleId;

  return (
    <>
      <Row>
        <Col lg>
          <div className={locals.headline}>
            <SvgIcon className={locals.icon} type="lib_alerts_user_impacted" size="l" />
            <span className={locals.title}>{form.get('name').value}</span>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg>
          {form.get('name').map(field => (
            <FormGroup>
              <Label htmlFor="team-name" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.name')}
              </Label>
              <Input
                id="team-name"
                value={field.value}
                onChange={e => {
                  setForm(form.updateIn(['name'], f => f.setValue(e.target.value).setTouched(true)));
                }}
                hasError={!field.valid && field.touched}
                disabled={isSystemGroup}
                autoFocus
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Users
            members={form.get('members').value}
            removeUser={id => {
              const members = form
                .get('members')
                .value.slice()
                .filter(member => member.userId !== id);
              setForm(form.updateIn(['members'], f => f.setValue(members).setTouched(true)));
            }}
            addUsers={users => addUsers(users, form, setForm)}
            noDelete={isOwnerGroup && form.get('members').value.length <= 2}
          />
        </Col>
        {form.get('permissionSet').map(field => (
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
              {productAreaPermissions.map(({ value, label }) => (
                <HorizontalFormGroup
                  key={label}
                  helpText={t('in-settings:tabs.permitsAccessToLabelMonitoringFunctionality', { label: label })}
                >
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

function addUsers(users, form, setForm) {
  setForm(
    form.updateIn(['members'], f =>
      f
        .setValue([...form.get('members').value, ...users.map(({ id, email }) => ({ userId: id, email }))])
        .setTouched(true)
    )
  );
}

function copyPermissionSet(form) {
  return { ...form.get('permissionSet').value };
}

function saveItem({ form, setMessage, setCanSaveItem, setForm }) {
  const group = {
    id: form.get('id').value,
    name: form.get('name').value,
    members: form.get('members').value,
    permissionSet: form.get('permissionSet').value
  };

  setMessage({ text: t('in-settings:tabs.savingGroup'), type: neutral, isSaving: true });

  saveGroup(group).once(
    savedGroup => {
      setMessage({ text: t('in-settings:tabs.groupSuccessfullySaved'), type: success });
      setForm(form.updateIn(['id'], f => f.setValue(savedGroup.id)));
      setCanSaveItem(false);
    },
    error => {
      setMessage({ text: t('in-settings:tabs.failedToSaveGroup', { err: error.message }), type: errorType });
    }
  );
}

function enrichForm(form, { result: { group } }) {
  return form
    .put(
      'id',
      createField({
        value: group.id
      })
    )
    .put(
      'name',
      createField({
        value: group.name,
        validator: notBlankValidator
      })
    )
    .put(
      'members',
      createField({
        value: group.members
      })
    )
    .put(
      'permissionSet',
      createField({
        value: group.permissionSet
      })
    );
}
