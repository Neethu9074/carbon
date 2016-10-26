import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import addSection from 'in-components/eventView/hocs/addSection';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './EventTraces.less';


const block = 'in-event-details-traces';
const itemClassName = `${block}__item`;

export default addSection(connectTo({
},
function EventTraces({}) {
  return (
    <DescriptionList className={block}>
      <DescriptionItem id='title'
                       title={
        <div className={`${block}__title-wrapper`}>
          <SvgIcon className={`${block}__icon`}
                   type='traces'
                   width={24}
                   color={'#22d8d8'} />
          Traces
        </div>
      }>
        <Button className={`${block}__button`}
                kind='secondary'
                size='sm'
                onClick={() => console.log('view')}>
          View
        </Button>

        <DescriptionList className={`${block}__metrics`}>
          <DescriptionItem className={itemClassName}
                           title='Number of traces'>
            10
          </DescriptionItem>
          <DescriptionItem className={itemClassName}
                           title='Avg response time'>
            0.5
          </DescriptionItem>
          <DescriptionItem className={itemClassName}
                           title='Highest response time'>
            4.2
          </DescriptionItem>
          <DescriptionItem className={itemClassName}
                           title='Avg error count'>
            3
          </DescriptionItem>
        </DescriptionList>
      </DescriptionItem>
    </DescriptionList>
  );
}),
isVisible
);

function isVisible(event) {
  return (event && event.getIn(['metadata', 'triggering']));
}
