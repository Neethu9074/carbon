import irpt from 'react-immutable-proptypes';
import React from 'react';

import RecentEventsCounter from 'in-components/sidebars/Incident/components/RecentEventsCounter';
import {formatDateTime, fromNow} from 'in-services/formatters/date';
import Icon from 'in-components/Icon';

import 'in-components/sidebars/Incident/components/Header.less';


const block = 'in-sidebar-incident-header';
const rpt = React.PropTypes;

export default function Header({incident}) {
  const numberOfIncidents = incident.get('recentEvents').size;
  const start = incident.get('start');
  const end = incident.get('end');

  return (
    <div className={block}>
      <div className={block + '__heading-wrapper'}>
        <div className={block + '__heading-wrapper__left'}>
          <Icon type={'incidents'}
                className={block + '__icon'}/>
          <h1 className={block + '__heading'}>
            {'incident (' + numberOfIncidents + ')'}
          </h1>
        </div>
        {fromNow(start)}
      </div>

      <div className={block + '__flex-wrapper'}>
        <KeyValue k='Started'
                  v={formatDateTime(start)} />

        <KeyValue k='Ended'
                  v={end ? formatDateTime(end) : 'still active'} />
      </div>

      <RecentEventsCounter incident={incident}/>
    </div>
  );
}

Header.propTypes = {
  incident: irpt.map.isRequired
};

function KeyValue({k, v}) {
  const className = block + '__key-value';

  return (
    <div className={className}>
      <h3 className={className + '__key'}>
        {k}
      </h3>
      {v}
    </div>
  );
}

KeyValue.propTypes = {
  v: rpt.string.isRequired,
  k: rpt.string.isRequired
};
