/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Spacer } from '@instana/components';

import { Update } from 'in-bizops/dashboards/perspectives/tabs/perspectiveConfiguration/Update';
import { Remove } from 'in-bizops/dashboards/perspectives/tabs/perspectiveConfiguration/Remove';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { businessPerspectiveDashboard } from 'in-bizops/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getBusinessPerspective } from 'in-bizops/api/perspectives';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { pendingResult } from 'in-services/fixedObjects';
import { PerspectiveFormItem } from 'in-bizops/types';
import { t } from 'in-i18n';

import local from 'in-bizops/dashboards/perspectives/tabs/perspectiveConfiguration/perspectiveConfiguration.mless';

export default function PerspectiveConfiguration() {
  const { location, goToPath } = useNavigation();
  const perspectiveId: string = getMatrixParameter(location, businessPerspectiveDashboard, 'perspectiveId') ?? '';
  const data = useObservable(getBusinessPerspective(perspectiveId), [perspectiveId]) ?? pendingResult;

  if (data?.progress?.loading) {
    return (
      <div className={local.parentDiv}>
        <div className={local.cardDiv}>
          <LoadingIndicator text={t('in-bizops:dashboards.perspectives.configuration.loadingText')} />
        </div>
      </div>
    );
  } else {
    // Map tagFilterExpression field from a TagFilterExpressionElementUnion to FormModelElement[]
    // type so that it can be used in the QueryBuilder
    let perspective = { ...data };
    delete perspective.tagFilterExpression;
    perspective.tagFilterExpression = fromBackendModel(data.tagFilterExpression);

    return (
      <div className={local.parentDiv}>
        <div className={local.cardDiv}>
          <Update perspective={perspective as PerspectiveFormItem} perspectiveId={perspectiveId} />
          <Spacer vertical="medium" />
          <Remove perspectiveId={perspectiveId} goToPath={goToPath} />
        </div>
      </div>
    );
  }
}
