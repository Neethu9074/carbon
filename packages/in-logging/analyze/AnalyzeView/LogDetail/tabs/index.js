import Summary from 'in-logging/analyze/AnalyzeView/LogDetail/tabs/Summary/Summary';
import { logsPath } from 'in-logging/navigation/paths';

export default function getTags({ path }) {
  return [
    {
      label: 'Detail',
      path: path ?? logsPath,
      component: Summary,
      hideTabLabelWhenAlone: true,
      noTopPadding: true
    }
  ];
}
