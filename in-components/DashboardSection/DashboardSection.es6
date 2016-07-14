import React from 'react';

import ContentHeading from '../ContentHeading';

import './DashboardSection.less';


const block = 'in-dashboard-section';
const rpt = React.PropTypes;


export default function DashboardSection({title, children}) {
  return (
    <div className={block}>
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
