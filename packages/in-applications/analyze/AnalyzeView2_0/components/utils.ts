/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

type ItemInfo = {
  item: any; // TODO: make type concrete after big files get migrated (e.g. Results.js)
  dataSource: 'calls' | 'traces' | 'subtraces';
};

export function getSeverity({ item, dataSource }: ItemInfo) {
  if (dataSource === 'traces') {
    return item.trace.erroneous ? 10 : 0;
  } else if (dataSource === 'subtraces') {
    return item.erroneous ? 10 : 0;
  } else return item.call.errorCount >= 1 ? 10 : 0;
}
