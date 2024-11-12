/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import { t } from 'in-i18n';

export const actionName = 'analyze';

export function getButton({ getHref$ }: { getHref$: () => Observable<string> }) {
  return {
    name: actionName,
    icon: 'lib_analyze',
    label: t('in-components:chart.viewInAnalyticsBtnLabel'),
    getHref$
  };
}
