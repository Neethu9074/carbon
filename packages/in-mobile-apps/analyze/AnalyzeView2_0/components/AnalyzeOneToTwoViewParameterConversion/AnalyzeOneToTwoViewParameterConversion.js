/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { transformOneZeroToTwoZero } from 'in-mobile-apps/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion/transformHelper';
import { beaconType as beaconTypeMatrixParameterName } from 'in-mobile-apps/navigation/matrix';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { createParameters } from 'in-components/AnalyzeView/parameters';
import { getMetricCatalog } from 'in-mobile-apps/api/metricCatalog';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import RedirectWithHash from 'in-components/RedirectWithHash';
import { analyzePath } from 'in-mobile-apps/navigation/paths';
import Sticky from 'in-components/Sticky';

export const analyzeTwoParameters = createParameters(analyzePath);

export default function AnalyzeOneToTwoViewParameterConversion({ dataSourceConfigurations }) {
  const { location, createHref } = useNavigation();
  const beaconType = getMatrixParameter(location, analyzePath, beaconTypeMatrixParameterName) || 'sessionStart';
  const tagCatalog = useTagCatalog(beaconType);
  const metricCatalogResult = useObservable(() => getMetricCatalog(), []);

  let redirectHref;
  if (tagCatalog != null && metricCatalogResult?.data) {
    transformOneZeroToTwoZero(location, tagCatalog, metricCatalogResult.data, dataSourceConfigurations[beaconType]);
    redirectHref = createHref(location);
  }

  return (
    <Sticky header={<AnalyzeHeader />}>
      <LoadingIndicator size="xxxl" />
      {redirectHref && <RedirectWithHash href={redirectHref} />}
    </Sticky>
  );
}
