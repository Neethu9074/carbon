/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useEffect, useState } from 'react';
import { MapForm } from 'formalistic';

import { ApdexConfiguration } from '@instana/types';

import { createForm } from 'in-custom-dashboards/widgets/Apdex/components/CreateApdexForm/form';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';

export default function useCreateApdexForm(
  apdexConfig: Partial<ApdexConfiguration>,
  entityType: ApdexEntityTypes,
  entityId: string
): [MapForm<any>, React.Dispatch<React.SetStateAction<MapForm<any>>>] {
  const [form, setForm] = useState<MapForm<any>>(createForm(apdexConfig, entityType, entityId));

  useEffect(() => {
    // Re-initialize form if apdexConfig has changed
    const newForm = createForm(apdexConfig, entityType, entityId);

    setForm(newForm);
  }, [apdexConfig, entityId, entityType]);

  return [form, setForm];
}
