/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import useFilteredApdexConfigurations from 'in-custom-dashboards/widgets/Apdex/hooks/useFilteredApdexConfigurations';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import ApdexList from 'in-custom-dashboards/widgets/Apdex/components/ApdexList';
import SlideInView, { NoHeader } from 'in-components/SlideInView/SlideInView';
import { noop } from 'in-services/fixedObjects';
import { ApdexConfiguration } from 'in-types';
import { t } from 'in-i18n';

interface ApdexManageListProps {
  entityType: ApdexEntityTypes;
  entityId: string;
  onChange: (apdex?: Partial<ApdexConfiguration>) => void;
}

export default function ApdexManageList({ entityType, entityId, onChange }: ApdexManageListProps) {
  const [apdexResult, setQuery] = useFilteredApdexConfigurations(entityType, entityId);
  const closeSlide = () => onChange(undefined);

  return (
    <SlideInView
      onShowSlideInContentChange={closeSlide}
      showSlideInContent={false}
      HeaderComponent={NoHeader}
      slideTransitionDurationMillis={500}
      slideInContentTitle={t('in-custom-dashboards:widgets.apdex.apdexManageList.title')}
      renderSlideInContent={() => <></>}
      staticContent={
        <ApdexList
          fetchedConfigState={apdexResult}
          onChange={({ query }) => setQuery(query ?? '')}
          onSelect={apdexConfig => onChange(apdexConfig)}
          onEdit={noop}
          onDelete={noop}
        />
      }
      enforceMaxHeightForStaticContent
    />
  );
}
