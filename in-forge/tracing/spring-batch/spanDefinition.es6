export function getLabel(span) {
  const job = span.getIn(['data', 'batch', 'job']);
  const status = span.getIn(['data', 'batch', 'status']);

  if (job && status) {
    return job + ' ' + status;
  } else if (job) {
    return job;
  }
  return null;
}
