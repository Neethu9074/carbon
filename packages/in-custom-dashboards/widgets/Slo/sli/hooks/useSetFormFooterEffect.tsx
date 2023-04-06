/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm } from 'formalistic';
import { useEffect } from 'react';
import React from 'react';

import ConfigFormFooter from 'in-custom-dashboards/widgets/Slo/components/ConfigFormFooter';

interface UseSetFormFooterEffectProps {
  form: MapForm<any>;
  formId: string;
  onCancel: () => void;
  setFooter: (footer: React.ReactNode) => void;
  isDisabled?: boolean;
  isSaving?: boolean;
  cloneOnly?: boolean;
}

export default function useSetFormFooterEffect({
  form,
  formId,
  isDisabled,
  setFooter,
  onCancel,
  isSaving,
  cloneOnly
}: UseSetFormFooterEffectProps): void {
  useEffect(() => {
    setFooter(
      <ConfigFormFooter
        form={form}
        formId={formId}
        onCancel={onCancel}
        isDisabled={isDisabled}
        cloneOnly={cloneOnly}
        isSaving={isSaving}
      />
    );

    return () => {
      setFooter(null);
    };
  }, [form, isSaving, setFooter, cloneOnly, formId, onCancel, isDisabled]);
}
