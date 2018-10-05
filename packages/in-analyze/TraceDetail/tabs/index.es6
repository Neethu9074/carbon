import { traceDetailFullyQualified } from 'in-analyze/navigation/paths';
import Summary from 'in-analyze/TraceDetail/tabs/Summary/Summary';

export default [
  {
    label: 'Summary',
    path: `${traceDetailFullyQualified}/tree`,
    component: Summary,
    hideTabLabelWhenAlone: true,
    isFullWidth: true
  }
];
