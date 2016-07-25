import React from 'react';

import ContentHeading from 'in-sdk/components/dashboard/ContentHeading';

import './DashboardSection.less';


const block = 'in-dashboard-section';
const rpt = React.PropTypes;


export default function DashboardSection({title, children, className}) {
  let classes = block;
  if (className) {
    classes = `${classes} ${className}`;
  }
  return (
    <div className={classes}>
      <ContentHeading>
        {title}
      </ContentHeading>
      {children}
    </div>
  );
}


DashboardSection.propTypes = {
  title: rpt.string.isRequired,
  children: rpt.any
};
