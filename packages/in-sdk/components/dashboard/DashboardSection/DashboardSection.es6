import React from 'react';

import ContentHeading from 'in-sdk/components/dashboard/ContentHeading';

import './DashboardSection.less';

const block = 'in-dashboard-section';

export default function DashboardSection({ title, children, className, button }) {
  let classes = block;
  if (className) {
    classes = `${classes} ${className}`;
  }
  return (
    <div className={classes}>
      <div className="in-dashboard-section-header">
        {title && <ContentHeading>{title}</ContentHeading>}
        {button}
      </div>
      {children}
    </div>
  );
}
