/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import {
  GetLinkToExploreProps,
  defaultInfraExploreViewParams,
  useLinkToExplore as useLinkToInfraEntityExplore
} from 'in-infrastructure/navigation/paths';
import BetaBadge from 'in-components/BetaBadge/BetaBadge';

export interface AnalyzeRelatedInstancesButtonProps extends GetLinkToExploreProps {
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
}

const defaultAnalyzeRelatedInstancesButtonParams = { ...defaultInfraExploreViewParams };

export default function AnalyzeRelatedInstancesButton(
  props: AnalyzeRelatedInstancesButtonProps = defaultAnalyzeRelatedInstancesButtonParams
) {
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();
  return (
    <Button
      kind="primary"
      icon="lib_analyze_inverted"
      href={getLinkToInfraEntityExplore(props)}
      onClick={props.onClick}
    >
      {t('in-infrastructure:explore.relatedInstances')}
      <div>
        <BetaBadge />
      </div>
    </Button>
  );
}
