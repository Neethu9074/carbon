import { createField, notBlankValidator } from 'formalistic';
import { just } from 'reactive-observables';
import React from 'react';

import { getGroupAsResultObservable, saveGroup, createNewGroup } from 'in-settings/tabs/TeamSettings/api/groups';
import LoadingGroup from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/LoadingGroup';
import Areas from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/Areas';
import { success, neutral, error as errorType } from 'in-new-components/Message/types';
import Users from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/Users';
import { teamSettingsAccessControlGroups } from 'in-settings/navigation/paths';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import { success as successResult } from 'in-services/util/result';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { productAreaPermissions } from 'in-stores/permission';
import ApiItemView from 'in-settings/components/ApiItemView';
import { savePermissionSet } from 'in-api/permissionSets';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-new-components/layout/Grid';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Group.mless';

export default function Group({ match }) {
  const groupId = match.params.id;
  return (
    <ApiItemView
      parentViewName="Groups"
      parentPath={teamSettingsAccessControlGroups}
      getObservables={() => ({
        group: groupId ? getGroupAsResultObservable(groupId) : just(successResult(createNewGroup()))
      })}
      enrichForm={enrichForm}
      saveItem={saveItem}
      renderLoadingState={renderLoadingState}
      render={renderGroup}
      // additional props which are passed down
      groupId={groupId}
    />
  );
}

function renderLoadingState() {
  return <LoadingGroup />;
}

function renderGroup(props) {
  const { setForm, form } = props;

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
                Name
              </Label>
              <Input
                id="team-name"
                value={field.value}
                onChange={e => {
                  setForm(form.updateIn(['name'], f => f.setValue(e.target.value).setTouched(true)));
                }}
                hasError={!field.valid && field.touched}
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
            userIds={form.get('userIds').value}
            removeUser={id => {
              const userIds = form
                .get('userIds')
                .value.slice()
                .filter(userId => userId !== id);
              setForm(form.updateIn(['userIds'], f => f.setValue(userIds).setTouched(true)));
            }}
            addUsers={users => addUsers(users, form, setForm)}
          />
        </Col>
        {form.get('permissionSet').map(field => (
          <Col lg={6}>
            <Areas
              permissionSet={field.value}
              update={(ids, dfq) => update(ids, dfq, form, setForm)}
              removeId={(id, propertyName) => removeId(id, propertyName, form, setForm)}
              removeDfq={() => removeDfq(form, setForm)}
            />
          </Col>
        ))}
      </Row>

      <Row>
        <Col lg>
          {form.get('permissionSet').map(field => (
            <FormGroup>
              <Label>Permission Scope</Label>
              {productAreaPermissions.map(({ value, label }) => (
                <HorizontalFormGroup key={label} helpText={`Permits access to '${label}' monitoring functionality.`}>
                  <Label htmlFor={`permission-${value}`}>{label}</Label>
                  <Toggle
                    id={`permission-${value}`}
                    checked={field.value.permissions.includes(value)}
                    onChange={() => tooglePermission(form, setForm, value)}
                  />
                </HorizontalFormGroup>
              ))}
            </FormGroup>
          ))}
        </Col>
      </Row>
    </>
  );
}

function tooglePermission(form, setForm, value) {
  const modifiedPermissionSet = copyPermissionSet(form);
  modifiedPermissionSet.permissions = modifiedPermissionSet.permissions.includes(value)
    ? modifiedPermissionSet.permissions.filter(v => v !== value)
    : [...modifiedPermissionSet.permissions, value];
  setForm(form.updateIn(['permissionSet'], f => f.setValue(modifiedPermissionSet).setTouched(true)));
}

function update(ids, infraDfqFilter, form, setForm) {
  const modifiedPermissionSet = copyPermissionSet(form);

  modifiedPermissionSet.applicationIds = [
    ...modifiedPermissionSet.applicationIds,
    ...ids.filter(({ item }) => !!item.application).map(mapToId)
  ];
  modifiedPermissionSet.kubernetesClusterUUIDs = [
    ...modifiedPermissionSet.kubernetesClusterUUIDs,
    ...ids.filter(({ item }) => !!item.k8sCluster).map(mapToId)
  ];
  modifiedPermissionSet.kubernetesNamespaceUIDs = [
    ...modifiedPermissionSet.kubernetesNamespaceUIDs,
    ...ids.filter(({ item }) => !!item.k8sNamespace).map(mapToId)
  ];
  modifiedPermissionSet.websiteIds = [
    ...modifiedPermissionSet.websiteIds,
    ...ids.filter(({ item }) => !!item.website).map(mapToId)
  ];
  modifiedPermissionSet.mobileAppIds = [
    ...modifiedPermissionSet.mobileAppIds,
    ...ids.filter(({ item }) => !!item.mobileApp).map(mapToId)
  ];
  modifiedPermissionSet.infraDfqFilter = infraDfqFilter;
  setForm(form.updateIn(['permissionSet'], f => f.setValue(modifiedPermissionSet).setTouched(true)));
}

function removeId(id, propertyName, form, setForm) {
  const modifiedPermissionSet = copyPermissionSet(form);
  modifiedPermissionSet[propertyName] = modifiedPermissionSet[propertyName].filter(v => v !== id);
  setForm(form.updateIn(['permissionSet'], f => f.setValue(modifiedPermissionSet).setTouched(true)));
}

function removeDfq(form, setForm) {
  const modifiedPermissionSet = copyPermissionSet(form);
  modifiedPermissionSet.infraDfqFilter = '';
  setForm(form.updateIn(['permissionSet'], f => f.setValue(modifiedPermissionSet).setTouched(true)));
}

function addUsers(users, form, setForm) {
  setForm(
    form.updateIn(['userIds'], f =>
      f.setValue([...form.get('userIds').value, ...users.map(user => user.id)]).setTouched(true)
    )
  );
}

function mapToId(item) {
  return item.id;
}

function copyPermissionSet(form) {
  return { ...form.get('permissionSet').value };
}

function saveItem({ form, setMessage, groupId }) {
  const permissionSet = form.get('permissionSet').value;
  const group = {
    id: form.get('id').value,
    name: form.get('name').value,
    members: form.get('userIds').value.map(id => ({ userId: id })),
    permissions: [{ id: permissionSet.id, scope: 'TU' }]
  };

  setMessage({ text: 'Saving group', type: neutral });
  savePermissionSet(permissionSet, groupId).once(
    () => {
      saveGroup(group).once(
        () => setMessage({ text: 'Group successfully saved.', type: success }),
        error => setMessage({ text: `Failed to save group: ${error.message}`, type: errorType })
      );
    },
    error => setMessage({ text: `Failed to save group: ${error.message}`, type: errorType })
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
      'userIds',
      createField({
        value: group.members.map(({ userId }) => userId)
      })
    )
    .put(
      'permissionSet',
      createField({
        value: group.permissionSet
      })
    );
}
