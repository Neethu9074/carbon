/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useMemo } from 'react';

import { Observable, just } from '@instana/observables';

import { createTagBasedLogPayloadConfigurator } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import getTagSuggestions from 'in-logging/subscriptions/getTagSuggestions';
import { CatalogResponse, getTagCatalog } from 'in-logging/api/catalog';
import { Result, CatalogUseCase, TagSuggestions } from 'in-types';
import { listSuccess } from 'in-services/util/result';

export default function useTagBasedPayloadConfigurator() {
  return useMemo(() => {
    const customPayloadTagCatalog: Observable<Result<CatalogResponse>> = getTagCatalog({
      useCase: 'SMART_ALERTS_CUSTOM_PAYLOAD'
    });

    return createTagBasedLogPayloadConfigurator({
      getTagCatalog: () => customPayloadTagCatalog,
      getSuggestions: params => {
        const { tagFilterExpression, name: tagName, timeConfig, propose, key } = params;
        return getTagCatalog({ useCase: 'TAG_SUGGESTIONS' as CatalogUseCase }).flatMap(
          tagCatalog =>
            (tagCatalog.data?.tags.map(({ name }) => name).includes(tagName)
              ? getTagSuggestions({
                  timeConfig,
                  tagName,
                  tagFilterExpression,
                  propose,
                  key
                })
              : just(listSuccess([]))) as Observable<Result<TagSuggestions>>
        );
      }
    });
  }, []);
}
