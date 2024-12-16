/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { TagCatalog, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { getUnifiedTagCatalog } from 'in-custom-dashboards/api';
import { getTagCatalogOnce } from 'in-services/tags/tagCatalog';
import useTimeConfig from 'in-hooks/useTimeConfig';

const getUnifiedTagCatalogOnce = getTagCatalogOnce(getUnifiedTagCatalog, true);

export default function useUnifiedTagCatalog(): TagCatalog | undefined {
  const timeConfig = useTimeConfig();

  // Creating a copy of TimeConfig and setting the window size to 1 minute.
  const modifiedTimeConfig = {
    ...timeConfig,
    windowSize: 60000
  } as TimeConfig;

  const tagCatalogResult = useObservable(
    () => getUnifiedTagCatalogOnce({ timeConfig: modifiedTimeConfig }),
    [timeConfig]
  );

  return tagCatalogResult?.data;
}
