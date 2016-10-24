import React from 'react';

import './TableHeader.less';

const block = 'in-table-view-table-header';

const cellClassName = `${block}__cell`;

export default function TableHeader({}) {
  return (
    <div className={block}>
      <p className={cellClassName}>
        Zone
      </p>
      <p className={cellClassName}>
        FQDN
      </p>
      <p className={cellClassName}>
        Hostname
      </p>
      <p className={cellClassName}>
        OS
      </p>
      <p className={cellClassName}>
        #CPUs
      </p>
      <p className={cellClassName}>
        CPU Usage
      </p>
      <p className={cellClassName}>
        Memory
      </p>
      <p className={cellClassName}>
        Memory Usage
      </p>
      <p className={cellClassName}>
        Health
      </p>
    </div>
  );
}
