export function getTrackingObject(form, paramsObj) {
  return {
    bluePrint: form.get('rule').get('alertType').value,
    ...paramsObj
  };
}
