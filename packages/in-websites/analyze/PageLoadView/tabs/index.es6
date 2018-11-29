import { pageLoadViewPathFullyQualified } from 'in-websites/navigation/paths';
import Summary from 'in-websites/analyze/PageLoadView/tabs/Summary/Summary';

export default [
  {
    label: 'Summary',
    path: `${pageLoadViewPathFullyQualified}/summary`,
    component: Summary,
    hideTabLabelWhenAlone: true,
    isFullWidth: true
  }
];
