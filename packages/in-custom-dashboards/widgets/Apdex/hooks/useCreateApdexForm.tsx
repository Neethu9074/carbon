/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useEffect, useState } from 'react';
import { MapForm } from 'formalistic';

import { apdexNameKey, createForm } from 'in-custom-dashboards/widgets/Apdex/components/CreateApdexForm/form';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import { setFieldValue } from 'in-custom-dashboards/widgets/Apdex/form';
import { ApdexConfiguration } from 'in-types';
import { t } from 'in-i18n';

export default function useCreateApdexForm(
  apdexConfig: Partial<ApdexConfiguration>,
  entityType: ApdexEntityTypes,
  entityId: string
): [MapForm, React.Dispatch<React.SetStateAction<MapForm>>] {
  const [form, setForm] = useState<MapForm>(createForm(apdexConfig, entityType, entityId));

  useEffect(() => {
    // Re-initialize form if apdexConfig has changed
    const editMode = !!apdexConfig?.id;
    const newForm = createForm(apdexConfig, entityType, entityId);

    if (!editMode) setForm(newForm);
    else {
      // Modify apdexName if editMode is enabled
      const newName = t('in-custom-dashboards:widgets.apdex.createApdexForm.apdexCloneName', {
        apdexName: apdexConfig?.apdexName
      });
      setForm(newForm.updateIn([apdexNameKey], item => setFieldValue(item, newName)));
    }
  }, [apdexConfig, entityId, entityType]);

  return [form, setForm];
}
