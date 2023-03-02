/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { transformTwoGAToPostGA } from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeTwoBetaViewParameterConversion/transformHelper';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { createParameters } from 'in-components/AnalyzeView/parameters';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import { analyzePath } from 'in-applications/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';
import Sticky from 'in-components/Sticky';

export const analyzeTwoParameters = createParameters(analyzePath);

export default function AnalyzeTwoBetaViewParameterConversion() {
  const { location, createHref } = useNavigation();
  transformTwoGAToPostGA(location);
  const redirectHref = createHref(location);

  return (
    <Sticky header={<AnalyzeHeader />}>
      <LoadingIndicator size="xxxl" />
      <RedirectWithHash href={redirectHref} />
    </Sticky>
  );
}
