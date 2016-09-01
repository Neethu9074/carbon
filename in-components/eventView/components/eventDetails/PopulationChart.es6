import React from 'react';

import TimeAxis from 'in-components/eventView/components/eventDetails/TimeAxis';
import Section from 'in-components/eventView/components/eventDetails/Section';
import {createColorPool} from 'in-services/util/ColorGenerator';
import {serverTime$} from 'in-stores/serverTime';
import createScale from 'in-charts/scale';
import connectTo from 'in-hoc/connectTo';

import './PopulationChart.less';


const colorPool = createColorPool('events', 10);
const block = 'in-event-view-event-detail-chart';

export default function PopulationChart({event}) {
  const start = event.get('start');
  const end = event.get('end');

  return (
    <Section>
      <div className={block}>
        <TimeAxis start={start}
                          end={end} />

        <div className={`${block}__graph-wrapper`}>
          <Element start={start}
                   end={end} />
        </div>
      </div>
    </Section>
  );
}

const Element = connectTo({
  serverTime: serverTime$
},
function Element({start, end, serverTime}) {
  end = end || serverTime;

  const scale = createScale();
  scale.setRangeFrom(0);
  scale.setRangeTo(100);
  scale.setDomainFrom(start);
  scale.setDomainTo(end);

  // TODO: use correct type or whatever
  const color = colorPool.getColorHex('id1');

  return (
    <div className={`${block}__element`}
        style={{
          width: (scale.getRangeTo() - scale.getRangeFrom()) + '%',
          background: color
        }}>
    </div>
  );
});
