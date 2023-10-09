/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import oldTheme from 'in-themes/active.json';
import { t } from 'in-i18n';

interface Color {
  id: string;
  label: string;
  color: string;
}

export const colors: Color[] = [
  {
    id: 'lightBlue',
    label: t('in-custom-dashboards:widgets.formCompChart.color.lightBlue'),
    color: oldTheme.lib.colors.lightBlue800
  },
  {
    id: 'green',
    label: t('in-custom-dashboards:widgets.formCompChart.color.green'),
    color: oldTheme.lib.colors.green800
  },
  {
    id: 'orange',
    label: t('in-custom-dashboards:widgets.formCompChart.color.orange'),
    color: oldTheme.lib.colors.orange800
  },
  {
    id: 'deepPurple',
    label: t('in-custom-dashboards:widgets.formCompChart.color.deepPurple'),
    color: oldTheme.lib.colors.deepPurple800
  },
  {
    id: 'cyan',
    label: t('in-custom-dashboards:widgets.formCompChart.color.cyan'),
    color: oldTheme.lib.colors.cyan800
  },
  {
    id: 'lime',
    label: t('in-custom-dashboards:widgets.formCompChart.color.lime'),
    color: oldTheme.lib.colors.lime800
  },
  {
    id: 'pink',
    label: t('in-custom-dashboards:widgets.formCompChart.color.pink'),
    color: oldTheme.lib.colors.pink800
  },
  {
    id: 'teal',
    label: t('in-custom-dashboards:widgets.formCompChart.color.teal'),
    color: oldTheme.lib.colors.teal800
  },
  {
    id: 'purple',
    label: t('in-custom-dashboards:widgets.formCompChart.color.purple'),
    color: oldTheme.lib.colors.purple800
  },
  {
    id: 'indigo',
    label: t('in-custom-dashboards:widgets.formCompChart.color.indigo'),
    color: oldTheme.lib.colors.indigo800
  },
  {
    id: 'red',
    label: t('in-custom-dashboards:widgets.formCompChart.color.red'),
    color: oldTheme.lib.colors.red800
  }
];
