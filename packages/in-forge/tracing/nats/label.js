/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export default function getLabel(span) {
  const subject = span.getIn(['data', 'nats', 'subject']);
  const sort = span.getIn(['data', 'nats', 'sort']);
  return `${sort === 'consume' ? 'Consume from' : 'Publish to'} ${subject}`;
}
