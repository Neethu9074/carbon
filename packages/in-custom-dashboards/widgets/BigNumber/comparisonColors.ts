/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { themes } from '@instana/design-tokens';

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
  backgroundColor: themes.default.ids.color.option.green[500],
  foregroundColor: '#ffffff'
};

export const red: ComparisonColor = {
  id: 'redish',
  label: t('in-custom-dashboards:widgets.bigNumber.comparisonColors.red'),
  backgroundColor: themes.default.ids.color.option.red[500],
  foregroundColor: '#ffffff'
};

export const yellow: ComparisonColor = {
  id: 'yellowish',
  label: t('in-custom-dashboards:widgets.bigNumber.comparisonColors.yellow'),
  backgroundColor: themes.default.ids.color.option.yellow[500],
  foregroundColor: themes.default.ids.color.option.neutral[900]
};

export const orange: ComparisonColor = {
  id: 'orangish',
  label: t('in-custom-dashboards:widgets.bigNumber.comparisonColors.orange'),
  backgroundColor: themes.default.ids.color.option.orange[500],
  foregroundColor: '#ffffff'
};

export const blue: ComparisonColor = {
  id: 'blueish',
  label: t('in-custom-dashboards:widgets.bigNumber.comparisonColors.blue'),
  backgroundColor: themes.default.ids.color.option.blue[500],
  foregroundColor: '#ffffff'
};
