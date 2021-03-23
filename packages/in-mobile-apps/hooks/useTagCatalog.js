/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';

import { getTagCatalog } from 'in-mobile-apps/api/tagCatalog';

export default function useTagCatalog(beaconType, useCase = 'FILTERING') {
  const tagCatalogResult = useObservable(() => getTagCatalog({ beaconType, useCase }), [beaconType, useCase]);
  return tagCatalogResult?.data;
}
