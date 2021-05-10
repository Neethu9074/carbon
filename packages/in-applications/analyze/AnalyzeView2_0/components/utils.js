/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export function getServerity({ item, dataSource }) {
  if (dataSource === 'traces') {
    return item.trace.erroneous ? 10 : 0;
  }
  return item.call.errorCount >= 1 ? 10 : 0;
}
