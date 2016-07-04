import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import {formatDateTime} from 'in-services/formatters/date';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const NginxInfo = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    return (
      <DescriptionList>
        <DescriptionItem title='Process ID'>
          {data.get('pid')}
        </DescriptionItem>
        <DescriptionItem title='Worker processes'>
          {data.get('worker_processes')}
        </DescriptionItem>
        <DescriptionItem title='Worker connections'>
          {data.get('worker_connections')}
        </DescriptionItem>
        <DescriptionItem title='Started At'>
          {formatDateTime(data.get('started_at'))}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default NginxInfo;
