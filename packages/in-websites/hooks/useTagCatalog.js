/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getTagCatalog } from 'in-websites/api/tagCatalog';
import useObservable from 'in-hooks/useObservable';

export default function useTagCatalog(beaconType, useCase = 'FILTERING') {
  const tagCatalogResult = useObservable(() => getTagCatalog({ beaconType, useCase }), [beaconType, useCase]);
  return tagCatalogResult?.data;
}
