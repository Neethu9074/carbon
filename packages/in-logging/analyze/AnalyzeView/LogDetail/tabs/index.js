import Summary from 'in-logging/analyze/AnalyzeView/LogDetail/tabs/Summary/Summary';
import { logsPath } from 'in-logging/navigation/paths';

export default [
  {
    label: 'Detail',
    path: logsPath,
    component: Summary,
    hideTabLabelWhenAlone: true,
    noTopPadding: true
  }
];
