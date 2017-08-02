import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import Button from 'in-components/Button';

import './DashboardTile.less';

const block = 'in-dashboard-tile';

export default function DashboardTile({ children, title, detailsLink }) {
  return (
    <div
      className={evaluateClassNames({
        [block]: true,
        [`${block}--with-details`]: detailsLink
      })}
    >
      <div className={`${block}__header`}>
        {title}
        <ViewDetailsButton href={detailsLink} />
      </div>

      {children}
    </div>
  );
}

function ViewDetailsButton({ href }) {
  if (!href) {
    return null;
  }

  return (
    <Button size="sm" href={href} className={`${block}__details-button`}>
      View Details
    </Button>
  );
}
