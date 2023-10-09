/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import oldTheme from 'in-themes';
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
  backgroundColor: oldTheme.lib.colors.green800,
  foregroundColor: '#ffffff'
};

export const red: ComparisonColor = {
  id: 'redish',
  label: t('in-custom-dashboards:widgets.bigNumber.comparisonColors.red'),
  backgroundColor: oldTheme.lib.colors.red800,
  foregroundColor: '#ffffff'
};

export const yellow: ComparisonColor = {
  id: 'yellowish',
  label: t('in-custom-dashboards:widgets.bigNumber.comparisonColors.yellow'),
  backgroundColor: oldTheme.lib.colors.yellow800,
  foregroundColor: oldTheme.lib.colors.N900Primary
};

export const orange: ComparisonColor = {
  id: 'orangish',
  label: t('in-custom-dashboards:widgets.bigNumber.comparisonColors.orange'),
  backgroundColor: oldTheme.lib.colors.orange800,
  foregroundColor: '#ffffff'
};

export const blue: ComparisonColor = {
  id: 'blueish',
  label: t('in-custom-dashboards:widgets.bigNumber.comparisonColors.blue'),
  backgroundColor: oldTheme.lib.colors.blue800,
  foregroundColor: '#ffffff'
};
