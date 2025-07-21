/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { CatalogUseCase, DataSource, Result, TagCatalog } from '@instana/types';
import { Observable } from '@instana/observables';

interface GetTagCatalogProps {
  useCase: CatalogUseCase;

  // Provide either beaconType or dataSource
  beaconType?: string;
  dataSource?: DataSource;
}

export const getTagCatalog: (args: GetTagCatalogProps) => Observable<Result<TagCatalog>>;
