import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './DashboardTile.less';

const block = 'in-dashboard-tile';

export default function DashboardTile({ children, title, href, href$ }) {
  return (
    <div
      className={evaluateClassNames({
        [block]: true,
        [`${block}--with-details`]: href || href$
      })}
    >
      <div className={`${block}__header`}>
        <span className={`${block}__title`}>
          {title}
        </span>
        {href$ ? <ConnectedViewDetailsButton href$={href$} /> : <ViewDetailsButton href={href} />}
      </div>

      {children}
    </div>
  );
}

const ConnectedViewDetailsButton = connectTo(props => {
  return {
    href: props.href$
  };
}, ViewDetailsButton);

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
