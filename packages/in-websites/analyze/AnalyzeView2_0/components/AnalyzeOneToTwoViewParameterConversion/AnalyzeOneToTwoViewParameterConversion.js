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
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import RedirectWithHash from 'in-components/RedirectWithHash';
import { analyzePath } from 'in-websites/navigation/paths';
import { getTagCatalog } from 'in-websites/api/tagCatalog';
import useObservable from 'in-hooks/useObservable';
import Sticky from 'in-components/Sticky';

export const analyzeTwoParameters = createParameters(analyzePath);

export default function AnalyzeOneToTwoViewParameterConversion() {
  const location = useLocation();
  const beaconType = getMatrixParameter(location, analyzePath, beaconTypeMatrixParameterName) || 'pageLoad';
  const tagCatalogResult = useObservable(() => getTagCatalog({ beaconType, useCase: 'FILTERING' }), [beaconType]);

  let redirectHref;
  if (tagCatalogResult?.data) {
    redirectHref = getModifiedUrl(location, location => transformOneZeroToTwoZero(location, tagCatalogResult.data));
  }

  return (
    <Sticky header={<AnalyzeHeader />}>
      <LoadingIndicator size="xxxl" />
      {redirectHref && <RedirectWithHash href={redirectHref} />}
    </Sticky>
  );
}
