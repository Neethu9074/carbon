import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator';

export default function DashboardButtonLine({ snapshotId, timeConfig }) {
  return (
    <EntityHealthIndicator
      showOkayOnNoIssues={false}
      IndicatorPresenter={HealthIndicatorButtonPresenter}
      snapshotId={snapshotId}
      timeConfig={timeConfig}
    />
  );
}
