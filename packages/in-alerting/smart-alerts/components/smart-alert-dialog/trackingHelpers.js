/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function getTrackingObject(form, paramsObj) {
  return {
    bluePrint: form.get('rule').get('alertType').value,
    ...paramsObj
  };
}
