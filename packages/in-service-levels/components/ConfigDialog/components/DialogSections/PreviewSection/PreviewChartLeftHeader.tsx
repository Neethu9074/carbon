/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { LoadingSkeleton, Stack, StackItem } from '@instana/components';

import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import SloEntityInfo from 'in-service-levels/components/SloList/components/SloEntityInfo';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { FetchStatus } from 'in-hooks/utils/types';

import locals from 'in-service-levels/components/ConfigDialog/components/DialogSections/PreviewSection/PreviewChartLeftHeader.mless';

interface WidgetLeftHeaderProps {
  status: FetchStatus;
}

export default function PreviewChartLeftHeader({ status }: WidgetLeftHeaderProps) {
  const { form } = useContext(SloFormContext);

  const entityType = form.getIn(['entity', 'type']).value;
  const title = form.getIn(['nameTags', 'name']).value;

  const titleToDisplay = title === '' ? valueMissingPlaceholder : title;
  const isLoading = status === 'pending';

  return (
    <div className={locals.headerContainer}>
      <Stack gap="xxsmall">
        <Stack direction="horizontal" align="center">
          <StackItem>
            {isLoading && <LoadingSkeleton />}
            {!isLoading && <SloEntityInfo entityType={entityType} entity={{ label: titleToDisplay }} />}
          </StackItem>
        </Stack>
      </Stack>
    </div>
  );
}
