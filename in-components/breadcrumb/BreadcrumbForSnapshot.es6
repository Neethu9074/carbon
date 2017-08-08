import React from 'react';

import { getLinkToSnapshotInCurrentView } from 'in-stores/navigation';
import PluginIcon from 'in-components/PluginIcon';
import { getLabel } from 'in-sdk/snapshot';
import Link from 'in-components/Link';

import './BreadcrumbForSnapshot.less';

const block = 'in-snapshot-breadcrumb';

export default function BreadcrumbForSnapshot({ snapshot }) {
  return (
    <Link href$={getLinkToSnapshotInCurrentView(snapshot.get('id'))} className={block}>
      <PluginIcon className={`${block}__icon`} dimension={14} snapshot={snapshot} />
      {getLabel(snapshot)}
    </Link>
  );
}
