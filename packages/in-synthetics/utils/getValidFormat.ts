/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ResultMetadataResponse } from 'in-synthetics/utils/constants';

export const LOGSFormatType = 'logs.tgz';
export const IMGFormatType = 'images.tar';
export const RECORDINGFormatType = 'recordings.tar';
const HARFormatType = 'har.json.gz';
const SUBFormatType = 'subtransactions.json.gz';
const formatOptions = [HARFormatType, SUBFormatType, LOGSFormatType, IMGFormatType, RECORDINGFormatType];
const formats: Record<string, string> = {
  'har.json.gz': 'HAR',
  'subtransactions.json.gz': 'SUBTRANSACTIONS',
  'logs.tgz': 'LOGS',
  'images.tar': 'IMAGES',
  'recordings.tar': 'VIDEOS'
};

export const getValidFormat = (metadata: ResultMetadataResponse) => {
  let optionFound = '';
  const keys = Object.keys(metadata.data?.metadata || {});
  // Check which options is present
  for (const option of formatOptions) {
    if (keys.includes(option)) {
      optionFound = option;
      break;
    }
  }
  return formats[optionFound];
};
