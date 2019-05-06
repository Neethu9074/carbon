import { fromJS } from 'immutable';
import { filter } from 'lodash';
import React from 'react';

import PermissionSets, {
  noRightHeader
} from 'in-settings/tabs/TeamSettings/pages/accessControl/Teams/components/PermissionSets';
import Users from 'in-settings/tabs/TeamSettings/pages/accessControl/Teams/components/Users';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import { Col, Row } from 'in-new-components/layout/Grid';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { getPermissionSets } from 'in-api/permissionSets';
import { getUsers } from 'in-api/users';

export default function TeamForm({ form, setForm, onChange }) {
  const permissions = form.get('permissions') ? form.get('permissions').value.toJS() : [];
  const selectedPermissionIds = permissions.map(permission => permission.id);
  const members = form.get('members') ? form.get('members').value.toJS() : [];
  const selectedUserIds = members.map(member => member.userId);

  return (
    <fieldset>
      {form.get('name').map(field => (
        <FormGroup>
          <Label htmlFor="team-name" hasError={!field.valid && field.touched}>
            Name
          </Label>
          <Input
            id="team-name"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            autoFocus
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      <Row>
        <Col>
          <PermissionSets
            setTitle={false}
            loadEntities={() => getSelectedPermissionSets(selectedPermissionIds)}
            hasRowNavigation={false}
            noDataMessage="No Scopes Selected"
            tableActions={permissionSetSelectionTableActions(form, setForm)}
            rightHeader={
              <SelectListDialogButton
                form={form}
                onSubmit={selectedIds => submitPermissionSetSelection(form, setForm, selectedIds)}
                title="Add Scopes"
                label={'Add Scopes'}
                listComponent={PermissionSets}
                listComponentRightHeader={noRightHeader}
                hiddenIds={selectedPermissionIds}
                limit={20} // some limit
                createSubmitLabel={numberOfItems =>
                  numberOfItems > 0 ? `Add ${numberOfItems} Scope${numberOfItems > 1 ? 's' : ''}` : 'Add'
                }
                requiresAtLeastOneMessage="Please select at least one scope."
              />
            }
          />
          <TouchedMessages field={form.get('permissions')} />
        </Col>
        <Col>
          <Users
            setTitle={false}
            loadEntities={() => getSelectedUsers(selectedUserIds)}
            hasRowNavigation={false}
            noDataMessage="No Users Selected"
            tableActions={userSelectionTableActions(form, setForm)}
            rightHeader={
              <SelectListDialogButton
                form={form}
                onSubmit={selectedIds => submitUserSelection(form, setForm, selectedIds)}
                title="Add Users"
                label={'Add Users'}
                listComponent={Users}
                listComponentRightHeader={noRightHeader}
                hiddenIds={selectedUserIds}
                limit={999} // some high limit, as it is mandatory
                createSubmitLabel={numberOfItems =>
                  numberOfItems > 0 ? `Add ${numberOfItems} User${numberOfItems > 1 ? 's' : ''}` : 'Add'
                }
                requiresAtLeastOneMessage="Please select at least one user."
              />
            }
          />
          <TouchedMessages field={form.get('members')} />
        </Col>
      </Row>
    </fieldset>
  );
}

function getSelectedPermissionSets(selectedPermissionSets = []) {
  return getPermissionSets().map(permissionSets =>
    filter(permissionSets, function(permissionSet) {
      return selectedPermissionSets.indexOf(permissionSet.id) >= 0;
    })
  );
}

function getSelectedUsers(selectedUsers = []) {
  return getUsers().map(users => {
    return filter(users, function(user) {
      return selectedUsers.indexOf(user.id) >= 0;
    });
  });
}

function permissionSetSelectionTableActions(form, setForm) {
  return {
    deselect: {
      deselect: deselectedEntity => {
        if (deselectedEntity) {
          setForm(
            form.updateIn(['permissions'], field => {
              return field
                .setValue(field.value.filterNot(reference => reference.id === deselectedEntity.id))
                .setTouched(true);
            })
          );
        }
      }
    }
  };
}

function userSelectionTableActions(form, setForm) {
  return {
    deselect: {
      deselect: deselectedEntity => {
        if (deselectedEntity) {
          setForm(
            form.updateIn(['members'], field => {
              return field
                .setValue(field.value.filterNot(reference => reference.userId === deselectedEntity.id))
                .setTouched(true);
            })
          );
        }
      }
    }
  };
}

function submitPermissionSetSelection(form, setForm, selectedIds) {
  setForm(
    form.updateIn(['permissions'], field => {
      let addedPermissions = [];
      selectedIds.map(id => addedPermissions.push({ id: id, scope: 'TU' }));
      return field.setValue(field.value.concat(fromJS(addedPermissions))).setTouched(true);
    })
  );
}

function submitUserSelection(form, setForm, selectedIds) {
  setForm(
    form.updateIn(['members'], field => {
      let addedMembers = [];
      selectedIds.map(id => addedMembers.push({ userId: id }));
      return field.setValue(field.value.concat(fromJS(addedMembers))).setTouched(true);
    })
  );
}
