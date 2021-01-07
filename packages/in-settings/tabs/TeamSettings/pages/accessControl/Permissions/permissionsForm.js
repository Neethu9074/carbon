import { createField } from 'formalistic';

// A small adapter so that this helper works with an immutableJS role or a plain JS object for API tokens.
function getInitialValue(role, fieldName) {
  if (role.get) {
    return role.get(fieldName);
  }
  return role[fieldName];
}

// getApiValue: has to be a function that determines which value to use. Currently, there is either permission.keyForGroupApi
// or permission.keyForApiTokenApi. Example usage of this function would be:
// addPermissionsFields(someForm, someRole, onlyApiTokenPermissions, (permission) => permission.keyForApiTokenApi);
export function addPermissionFields(form, role, permissions, getValue) {
  permissions.forEach(permission => {
    const value = getValue(permission);
    form = form.put(value, createField({ value: getInitialValue(role, value) }));
  });

  return form;
}
