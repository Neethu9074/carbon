/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { t } from 'in-i18n';

export interface RawDataForModalTable {
  [key: string]: {
    title: string;
    value: string;
  };
}

type ModifiedDataForModalTable = { id: string; title: string; value: string }[];

export const normalizeMapDataForModalTable = (data: RawDataForModalTable): ModifiedDataForModalTable => {
  const modifiedTableData = Object.entries(data).reduce<ModifiedDataForModalTable>(
    (accumulator, [countryId, dataObject]) => {
      const { title, value } = dataObject;
      const isTitleEmpty = typeof title === 'string' && title.trim().length === 0;

      accumulator.push({
        id: countryId,
        title: isTitleEmpty ? t('in-components:geoHeatMap.unknownTitle') : title,
        value
      });

      return accumulator;
    },
    []
  );

  return modifiedTableData;
};
