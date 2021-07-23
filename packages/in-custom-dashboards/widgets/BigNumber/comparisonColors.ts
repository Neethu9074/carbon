/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import theme from 'in-themes';
import { t } from 'in-i18n';

export interface ComparisonColor {
  id: string;
  label: string;
  backgroundColor: string;
  foregroundColor: string;
}

export const green: ComparisonColor = {
  id: 'greenish',
  label: t('in-custom-dashboards:widgets.bigNumber.comparisonColors.green'),
  backgroundColor: theme.lib.colors.green800,
  foregroundColor: '#ffffff'
};

export const red: ComparisonColor = {
  id: 'redish',
  label: t('in-custom-dashboards:widgets.bigNumber.comparisonColors.red'),
  backgroundColor: theme.lib.colors.red800,
  foregroundColor: '#ffffff'
};

export const yellow: ComparisonColor = {
  id: 'yellowish',
  label: t('in-custom-dashboards:widgets.bigNumber.comparisonColors.yellow'),
  backgroundColor: theme.lib.colors.yellow800,
  foregroundColor: theme.lib.colors.N900Primary
};

export const orange: ComparisonColor = {
  id: 'orangish',
  label: t('in-custom-dashboards:widgets.bigNumber.comparisonColors.orange'),
  backgroundColor: theme.lib.colors.orange800,
  foregroundColor: '#ffffff'
};

export const blue: ComparisonColor = {
  id: 'blueish',
  label: t('in-custom-dashboards:widgets.bigNumber.comparisonColors.blue'),
  backgroundColor: theme.lib.colors.blue800,
  foregroundColor: '#ffffff'
};
