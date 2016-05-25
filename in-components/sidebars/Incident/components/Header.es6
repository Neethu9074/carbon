/* eslint-disable react/no-multi-comp */
import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import moment from 'moment';
import React from 'react';

import RecentEventsCounter from 'in-components/sidebars/incident/components/RecentEventsCounter';
import {formatDateTime} from 'in-services/formatters/date';
import Icon from 'in-components/Icon';

import 'in-components/sidebars/incident/components/Header.less';


const block = 'in-sidebar-incident-header';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'Header',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    incident: irpt.map.isRequired
  },

  render() {
    const incident = this.props.incident;
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
          {moment(start).fromNow()}
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
});

const KeyValue = React.createClass({

  displayName: 'KeyValue',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    v: rpt.string.isRequired,
    k: rpt.string.isRequired
  },

  render() {
    const className = block + '__key-value';

    return (
      <div className={className}>
        <h3 className={className + '__key'}>
          {this.props.k}
        </h3>
        {this.props.v}
      </div>
    );
  }
});
