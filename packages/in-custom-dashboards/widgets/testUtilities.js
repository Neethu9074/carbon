/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

export function getWidgetStateManagementMock(initialForm) {
  const result = {
    onChange: jest.fn(onChange),
    form: initialForm
  };

  return result;

  function onChange(path, fn) {
    result.form = result.form.updateIn(path, fn);
  }
}
