/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/legacy';
import { t } from '@instana/i18n-react';

import {
  GetLinkToExploreProps,
  defaultInfraExploreViewParams,
  useLinkToExplore as useLinkToInfraEntityExplore
} from 'in-infrastructure/navigation/paths';

export interface AnalyzeInfrastructureButtonProps extends GetLinkToExploreProps {
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
}

const defaultAnalyzeInfrastructureButtonParams = { ...defaultInfraExploreViewParams };

export default function AnalyzeInfrastructureButton(
  props: AnalyzeInfrastructureButtonProps = defaultAnalyzeInfrastructureButtonParams
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
    </Button>
  );
}
