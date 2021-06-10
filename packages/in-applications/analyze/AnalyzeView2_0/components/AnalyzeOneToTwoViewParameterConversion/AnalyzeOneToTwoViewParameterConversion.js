/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useLocation } from 'react-router';
import React from 'react';

import { transformOneZeroToTwoZero } from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion/transformHelper';
import { getTagCatalog as getTracesTagCatalog } from 'in-applications/analyze/components/workspace/TraceQueryBuilder';
import { getTagCatalog as getCallsTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { createParameters } from 'in-components/AnalyzeView/parameters';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getModifiedUrl } from 'in-stores/navigation/navigation';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { analyzePath } from 'in-applications/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';
import Sticky from 'in-components/Sticky';

export const analyzeTwoParameters = createParameters(analyzePath);

export default function AnalyzeOneToTwoViewParameterConversion({ dataSourceConfigurations }) {
  const location = useLocation();
  const dataSource = getMatrixParameter(location, analyzePath, 'callList.dataSource') || 'calls';

  const tagCatalog = useTagCatalog(dataSource === 'traces' ? getTracesTagCatalog : getCallsTagCatalog);

  let redirectHref;
  if (tagCatalog != null) {
    redirectHref = getModifiedUrl(location, location =>
      transformOneZeroToTwoZero(location, tagCatalog, dataSourceConfigurations[dataSource])
    );
  }

  return (
    <Sticky header={<AnalyzeHeader />}>
      <LoadingIndicator size="xxxl" />
      {redirectHref && <RedirectWithHash href={redirectHref} />}
    </Sticky>
  );
}
