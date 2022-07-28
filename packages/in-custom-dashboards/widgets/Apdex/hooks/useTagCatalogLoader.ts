/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useMemo } from 'react';

import { ApdexConfiguration } from '@instana/types';
import { just } from '@instana/observables';

import {
  isApplicationApdexConfiguration,
  isWebsiteApdexConfiguration
} from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import { getTagCatalog as getWebsiteTagCatalog } from 'in-websites/api/tagCatalog';
import { getApplicationTagCatalog } from 'in-applications/api/catalog';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { pendingResult } from 'in-services/fixedObjects';
import { error } from 'in-services/util/result';

export default function useTagCatalogLoader(config?: ApdexConfiguration): Parameters<typeof useTagCatalog>[0] {
  return useMemo(() => {
    if (!config) {
      return () => just(pendingResult);
    }

    if (isWebsiteApdexConfiguration(config)) {
      const {
        apdexEntity: { beaconType }
      } = config;
      return () => getWebsiteTagCatalog({ beaconType, useCase: 'FILTERING' });
    }

    if (isApplicationApdexConfiguration(config)) {
      return getApplicationTagCatalog({ dataSource: 'CALLS', useCase: 'FILTERING' });
    }

    return () => just(error([]));
  }, [config]);
}
