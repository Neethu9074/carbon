import { createMapForm, createField, createListForm, notBlankValidator } from 'formalistic';
import { isBlank } from 'in-services/util/string';

export function createForm(savedState) {
  let listForm = createListForm({
    validator: atLeastOneTimeZoneRequiredValidator,
    items: (savedState || []).map(createTimeZoneSubForm)
  });

  if (!savedState) {
    listForm = listForm.push(createTimeZoneSubForm({ timeZone: 'UTC', label: 'UTC' }));
  }

  return listForm;
}

export function createTimeZoneSubForm({ timeZone, label } = {}) {
  return createMapForm()
    .put(
      'timeZone',
      createField({
        value: timeZone || '',
        validator: timeZoneRequired
      })
    )
    .put(
      'label',
      createField({
        value: label || '',
        validator: notBlankValidator
      })
    );
}

function atLeastOneTimeZoneRequiredValidator(items) {
  if (items.length > 0) {
    return null;
  }

  return [
    {
      severity: 'error',
      message: 'At least one time zone must be configured.'
    }
  ];
}

function timeZoneRequired(value) {
  if (isBlank(value)) {
    return [
      {
        severity: 'error',
        message: 'Please select a time zone.'
      }
    ];
  }

  return null;
}
