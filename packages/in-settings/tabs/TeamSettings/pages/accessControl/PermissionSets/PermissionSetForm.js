import { fromJS } from 'immutable';
import { filter } from 'lodash';
import React from 'react';

import Applications, {
  noRightHeader
} from 'in-settings/tabs/TeamSettings/pages/accessControl/PermissionSets/components/Applications';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import { getApplications, getProductAreaPermissions } from 'in-api/permissionSets';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

export default function PermissionSetForm({ form, setForm, onChange }) {
  const selectedApplications = form.get('applicationIds') ? form.get('applicationIds').value.toJS() : [];

  return (
    <fieldset>
      <SectionHeading>General</SectionHeading>
      {form.get('name').map(field => (
        <FormGroup>
          <Label htmlFor="permission-set-name" hasError={!field.valid && field.touched}>
            Name
          </Label>
          <Input
            id="permission-set-name"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            autoFocus
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      <SectionHeading>Product Areas</SectionHeading>
      {getProductAreaPermissions().map(area => (
        <Permission
          key={area.value}
          form={form}
          setForm={setForm}
          permission={area.value}
          label={`Access '${area.label}' monitoring`}
          helpText={`Permits access to '${area.label}' monitoring functionality.`}
          disabled={false}
        />
      ))}

      <Applications
        setTitle={false}
        loadEntities={() => getSelectedApplicationConfigs(selectedApplications)}
        hasRowNavigation={false}
        noDataMessage="No Application Perspectives Selected"
        tableActions={applicationSelectionTableActions(form, setForm)}
        rightHeader={
          <SelectListDialogButton
            form={form}
            onSubmit={selectedIds => submitApplicationSelection(form, setForm, selectedIds)}
            title="Add Application Perspectives"
            label={'Add Application Perspectives'}
            listComponent={Applications}
            listComponentRightHeader={noRightHeader}
            hiddenIds={selectedApplications}
            limit={999} // some high limit, as it is mandatory
            createSubmitLabel={numberOfItems =>
              numberOfItems > 0 ? `Add ${numberOfItems} Application Perspective${numberOfItems > 1 ? 's' : ''}` : 'Add'
            }
            requiresAtLeastOneMessage="Please select at least one application Perspectives."
          />
        }
      />
      <TouchedMessages field={form.get('applicationIds')} />
    </fieldset>
  );
}

function getSelectedApplicationConfigs(selectedApplications = []) {
  return getApplications().map(application =>
    filter(application, function(app) {
      return selectedApplications.indexOf(app.id) >= 0;
    })
  );
}

function applicationSelectionTableActions(form, setForm) {
  return {
    deselect: {
      deselect: deselectedEntity => {
        if (deselectedEntity) {
          setForm(
            form.updateIn(['applicationIds'], field => {
              return field
                .setValue(field.value.filterNot(referencedId => referencedId === deselectedEntity.id))
                .setTouched(true);
            })
          );
        }
      }
    }
  };
}

function submitApplicationSelection(form, setForm, selectedIds) {
  setForm(
    form.updateIn(['applicationIds'], field => {
      return field.setValue(field.value.concat(fromJS(selectedIds))).setTouched(true);
    })
  );
}

function tooglePermission(form, setForm, permission) {
  setForm(
    form.updateIn(['permissions'], field => {
      if (field.value.includes(permission)) {
        return field.setValue(field.value.filterNot(permitted => permitted === permission)).setTouched(true);
      }
      return field.setValue(field.value.push(permission)).setTouched(true);
    })
  );
}

function Permission({ form, setForm, permission, label, helpText, disabled }) {
  const field = form.get('permissions');
  return (
    <HorizontalFormGroup helpText={helpText}>
      <Label htmlFor={`permission-${permission}`}>{label}</Label>
      <Toggle
        id={`permission-${permission}`}
        checked={field.value.includes(permission)}
        onChange={() => tooglePermission(form, setForm, permission)}
        disabled={disabled}
      />
    </HorizontalFormGroup>
  );
}
