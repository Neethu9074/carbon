import Summary from 'in-logging/analyze/AnalyzeView/LogDetail/tabs/Summary/Summary';
import { analyzePathFullyQualified } from 'in-logging/navigation/paths';

export default [
  {
    label: 'Detail',
    path: analyzePathFullyQualified,
    component: Summary,
    hideTabLabelWhenAlone: true,
    noTopPadding: true
  }
];
