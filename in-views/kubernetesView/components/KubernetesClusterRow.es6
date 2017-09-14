import React from 'react';

import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import { getDashboardLink } from 'in-stores/navigation';
import KubernetesKpiSection from 'in-views/kubernetesView/components/KubernetesKpiSection';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './KubernetesClusterRow.less';

const block = 'in-kubernetes-table-row';

export default function KubernetesClusterRow({ snapshot, data, pageHash }) {
  const snapshotId = snapshot.get('id');

  const kpis = `${block}__kpis`;

  const nameElement = `${block}__name`;

  return (
    <div key={data.name} className={block}>
      <div className={nameElement}>
        {data.name}
        <ViewDetailsButton snapshotId={snapshotId} pageHash={pageHash} />
      </div>

      <div className={kpis}>
        <KubernetesKpiSection snapshotId={snapshotId} data={data} />
      </div>
    </div>
  );
}

const ViewDetailsButton = connectTo(
  props => {
    if (props.pageHash) {
      return {
        href: getSubDashboardLink(`/pages/${props.pageHash}`)
      };
    }
    return {
      href: getDashboardLink(props.snapshotId)
    };
  },
  function ViewDetailsButton({ href }) {
    return (
      <Button size="sm" kind="secondaryv2" href={href} className={`${block}__details-button`}>
        View Details
      </Button>
    );
  }
);
