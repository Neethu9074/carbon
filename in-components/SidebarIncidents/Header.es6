/* eslint-disable react/no-multi-comp */
import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import moment from 'moment';
import React from 'react';

import './Header.less';


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

    return (
      <div className={block}>
        <h1 className={block + '__heading'}>
          incident
        </h1>

        <KeyValue k='Started'
                  v={moment(incident.get('start')).fromNow()} />

        <KeyValue k='Ended'
                  v={incident.get('end', 'still active')} />
        <br />
        <KeyValue k='Events'
                  v={incident.get('referencedEvents').size + ''} />
      </div>
    );
  }
});

export const KeyValue = React.createClass({

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
        <span className={className + '__key'}>
          {this.props.k}
        </span>
        <span className={className + '__value'}>
          {this.props.v}
        </span>
      </div>
    );
  }
});
