/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useEffect } from 'react';
import React from 'react';

import ConfigFormFooter from 'in-custom-dashboards/widgets/SloLegacy/components/ConfigFormFooter';

interface UseSetFormFooterEffectProps {
  formId: string;
  onCancel: () => void;
  setFooter: (footer: React.ReactNode) => void;
  isDisabled?: boolean;
  isSaving?: boolean;
  cloneOnly?: boolean;
}

export default function useSetFormFooterEffect({
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
  }, [isSaving, setFooter, cloneOnly, formId, onCancel, isDisabled]);
}
