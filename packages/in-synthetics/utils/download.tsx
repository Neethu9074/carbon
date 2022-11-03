/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

// eslint-disable-next-line no-restricted-imports
import { ResultDetailsResponse } from 'in-synthetics/utils/constants';

export default function download(resultDetails: ResultDetailsResponse, fileType: string) {
  let detailData;
  let suffix = '';

  switch (fileType) {
    case 'HAR':
      detailData = resultDetails.data?.har ?? '';
      suffix = '.json';
      break;

    case 'LOG':
      detailData = resultDetails.data?.logs;
      suffix = '.log';
      break;
  }

  const fileName: string = fileType.toLowerCase();

  const a: HTMLAnchorElement = document.body.appendChild(document.createElement('a'));
  a.download = fileName + suffix;
  a.href = `data:text/json;charset=utf-8, ${encodeURIComponent(JSON.stringify(detailData, null, 2))}`;
  a.click();
}
