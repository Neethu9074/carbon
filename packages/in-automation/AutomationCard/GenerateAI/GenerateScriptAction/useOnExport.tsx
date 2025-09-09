/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Link } from '@instana/components';
import { Result } from '@instana/types';

import useNavigateToActionCatalog from 'in-automation/navigation/hooks/useNavigateToActionCatalog';
import { ExportForm } from 'in-automation/AutomationCard/GenerateAI/CopyActionStepForm';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { refresh } from 'in-automation/ActionCatalog/useActions';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { getGitops } from 'in-automation/api';
import { Trans, t } from 'in-i18n';

export default function useOnExport(forRecommededAction: boolean) {
  const navigateToActionCatalog = useNavigateToActionCatalog();
  function onExport({
    exportForm,
    data,
    setResultUrl,
    closeHandler,
    resolve,
    reject,
    setIsValid
  }: {
    exportForm: ExportForm;
    data: any;
    setResultUrl: React.Dispatch<React.SetStateAction<Result<any> | null>>;
    closeHandler?: () => void;
    resolve?: () => void;
    reject?: () => void;
    setIsValid?: (isValid: boolean) => void;
  }) {
    if (!exportForm.hierarchyValid) {
      return;
    }

    setResultUrl(pendingResult);
    getGitops(data)
      .filter(res => !isLoading(res))
      .once(result => {
        setResultUrl(result);

        if (hasError(result)) {
          setIsValid?.(false);
          reject?.();
          return;
        }
        createPRSuccessNotification(result?.data?.pull_request_url!);

        if (!forRecommededAction) {
          navigateToActionCatalog();
          refresh();
          resolve?.();
        }
        closeHandler?.();
      });
  }
  return {
    onExport
  };
}

function PRSuccess({ pr }: { pr: string }) {
  return (
    <Trans
      i18nKey={'in-automation:GenerateAIActionDialog.exportToGit.success.content'}
      values={{
        pr_url: pr
      }}
      components={{
        // @ts-expect-error
        Link: <Link external href={pr} />
      }}
    />
  );
}

export function createPRSuccessNotification(prLink: string) {
  addMessage({
    type: 'info',
    timeout: 10000,
    title: t('in-automation:GenerateAIActionDialog.exportToGit.success.title'),
    content: <PRSuccess pr={prLink} />
  });
}
