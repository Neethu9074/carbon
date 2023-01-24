/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';

import { GetTagCatalog } from 'in-components/QueryBuilder';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TagCatalog } from 'in-types';

export default function useTagCatalog(getTagCatalog: GetTagCatalog): TagCatalog | undefined {
  const timeConfig = useTimeConfig();
  const tagCatalogResult = useObservable(() => getTagCatalog({ timeConfig }), [getTagCatalog, timeConfig]);

  return tagCatalogResult?.data;
}
