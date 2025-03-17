/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { GetUnifiedCatalogQuery, TagCatalog } from '@instana/types';
import { useObservable } from '@instana/hooks';

import getUnifiedTagCatalog from 'in-custom-dashboards/components/getUnifiedTagCatalog';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function useUnifiedTagCatalog(): TagCatalog | undefined {
  const timeConfig = useTimeConfig();

  const tagCatalogResult = useObservable(
    () =>
      getUnifiedTagCatalog({
        timeConfig,
        includeInternalTags: false,
        query: ''
      } as GetUnifiedCatalogQuery),
    [timeConfig]
  );

  return tagCatalogResult?.data;
}
