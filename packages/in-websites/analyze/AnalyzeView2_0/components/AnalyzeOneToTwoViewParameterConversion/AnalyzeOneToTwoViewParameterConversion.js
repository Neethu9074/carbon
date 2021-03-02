/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useLocation } from 'react-router';
import React from 'react';

import { transformOneZeroToTwoZero } from 'in-websites/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion/transformHelper';
import { beaconType as beaconTypeMatrixParameterName } from 'in-websites/navigation/matrix';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { createParameters } from 'in-new-components/AnalyzeView/parameters';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getModifiedUrl } from 'in-stores/navigation/navigation';
import { getMetricCatalog } from 'in-websites/api/metricCatalog';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import useTagCatalog from 'in-websites/hooks/useTagCatalog.js';
import RedirectWithHash from 'in-components/RedirectWithHash';
import { analyzePath } from 'in-websites/navigation/paths';
import useObservable from 'in-hooks/useObservable';
import Sticky from 'in-components/Sticky';

export const analyzeTwoParameters = createParameters(analyzePath);

export default function AnalyzeOneToTwoViewParameterConversion() {
  const location = useLocation();
  const beaconType = getMatrixParameter(location, analyzePath, beaconTypeMatrixParameterName) || 'pageLoad';
  const tagCatalog = useTagCatalog(beaconType);
  const metricCatalogResult = useObservable(() => getMetricCatalog(), []);

  let redirectHref;
  if (tagCatalog != null && metricCatalogResult?.data) {
    redirectHref = getModifiedUrl(location, location =>
      transformOneZeroToTwoZero(location, tagCatalog, metricCatalogResult.data)
    );
  }

  return (
    <Sticky header={<AnalyzeHeader />}>
      <LoadingIndicator size="xxxl" />
      {redirectHref && <RedirectWithHash href={redirectHref} />}
    </Sticky>
  );
}
