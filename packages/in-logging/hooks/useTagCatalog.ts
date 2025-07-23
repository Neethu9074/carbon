/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { CatalogUseCase } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { getTagCatalog, CatalogResponse } from 'in-logging/api/catalog';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function useTagCatalog(useCase: CatalogUseCase = 'FILTERING'): CatalogResponse | undefined {
  const timeConfig = useTimeConfig();
  const tagCatalogResult = useObservable(() => getTagCatalog({ useCase, timeConfig }), [useCase, timeConfig]);

  return tagCatalogResult?.data;
}
