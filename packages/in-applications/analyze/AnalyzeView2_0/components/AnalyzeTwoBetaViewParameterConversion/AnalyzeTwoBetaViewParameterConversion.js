/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useLocation } from 'react-router';
import React from 'react';

import { transformTwoGAToPostGA } from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeTwoBetaViewParameterConversion/transformHelper';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { createParameters } from 'in-new-components/AnalyzeView/parameters';
import { getModifiedUrl } from 'in-stores/navigation/navigation';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import { analyzePath } from 'in-applications/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';
import Sticky from 'in-components/Sticky';

export const analyzeTwoParameters = createParameters(analyzePath);

export default function AnalyzeTwoBetaViewParameterConversion() {
  const location = useLocation();
  const redirectHref = getModifiedUrl(location, location => transformTwoGAToPostGA(location));

  return (
    <Sticky header={<AnalyzeHeader />}>
      <LoadingIndicator size="xxxl" />
      {redirectHref && <RedirectWithHash href={redirectHref} />}
    </Sticky>
  );
}
