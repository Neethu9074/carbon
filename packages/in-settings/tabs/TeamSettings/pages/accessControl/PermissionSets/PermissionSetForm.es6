import { fromJS } from 'immutable';
import { filter } from 'lodash';
import React from 'react';

import Applications, {
  noRightHeader
} from 'in-settings/tabs/TeamSettings/pages/accessControl/PermissionSets/components/Applications';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import SectionHeading from 'in-settings/components/SectionHeading';
import { getApplicationConfigs } from 'in-api/applicationConfigs';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import { getProductAreas } from 'in-api/permissionSets';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

export default function PermissionSetForm({ form, setForm, onChange }) {
  const selectedApplications = form.get('applicationIds') ? form.get('applicationIds').value.toJS() : [];

  return (
    <fieldset>
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
      {getProductAreas().map(area => (
        <Permission
          key={area.value}
          form={form}
          setForm={setForm}
          permission={area.value}
          label={`Access '${area.label}' monitoring`}
          helpText={`Permits '${area.label}' monitoring functionality.`}
          disabled={false}
        />
      ))}

      <SectionHeading>Whitelist</SectionHeading>
      <Applications
        setTitle={false}
        loadEntities={() => getSelectedApplicationConfigs(selectedApplications)}
        hasRowNavigation={false}
        noDataMessage="No Applications Selected"
        tableActions={applicationSelectionTableActions(form, setForm)}
        rightHeader={
          <SelectListDialogButton
            form={form}
            onSubmit={selectedIds => submitApplicationSelection(form, setForm, selectedIds)}
            title="Add Applications"
            label={'Add Applications'}
            listComponent={Applications}
            listComponentRightHeader={noRightHeader}
            hiddenIds={selectedApplications}
            limit={20} // some limit
            createSubmitLabel={numberOfItems =>
              numberOfItems > 0 ? `Add ${numberOfItems} Application${numberOfItems > 1 ? 's' : ''}` : 'Add'
            }
            requiresAtLeastOneMessage="Please select at least one application."
          />
        }
      />
      <TouchedMessages field={form.get('applicationIds')} />
    </fieldset>
  );
}

function getSelectedApplicationConfigs(selectedApplications = []) {
  return getApplicationConfigs().map(configs =>
    filter(configs, function(app) {
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
