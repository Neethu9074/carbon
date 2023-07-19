/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useMemo } from 'react';

import { WebsiteBeaconType, CustomPayloadFieldUnion, DynamicField, isDynamicField } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { getTagCatalog } from 'in-websites/api/tagCatalog';
import { hasError } from 'in-services/util/result';

export default function useVerifyCustomPayloadItemsWithTagCatalog(
  beaconType: WebsiteBeaconType,
  customPayloadFields: CustomPayloadFieldUnion[]
): boolean {
  const customPayloadTagCatalog = useMemo(() => {
    return getTagCatalog({
      beaconType,
      useCase: 'SMART_ALERTS_CUSTOM_PAYLOAD'
    });
  }, [beaconType]);

  const tagCatalogResult = useObservable(customPayloadTagCatalog, []);

  if (!tagCatalogResult || hasError(tagCatalogResult)) return false;

  const tags = tagCatalogResult.data?.tags;

  const verifyTagExists = (fieldValue: DynamicField) => tags?.find(apiTag => apiTag.name === fieldValue.value.tagName);

  return customPayloadFields.filter(isDynamicField).every(verifyTagExists);
}
