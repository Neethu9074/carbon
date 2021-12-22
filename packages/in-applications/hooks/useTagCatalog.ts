/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Result, TagCatalog, TimeConfig } from 'in-types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

export default function useTagCatalog(
  getTagCatalog: (tc: { timeConfig: TimeConfig }) => Observable<Result<TagCatalog>>
): TagCatalog | undefined {
  const timeConfig = useTimeConfig();
  const tagCatalogResult = useObservable(() => getTagCatalog({ timeConfig }), [getTagCatalog, timeConfig]);

  return tagCatalogResult?.data;
}
