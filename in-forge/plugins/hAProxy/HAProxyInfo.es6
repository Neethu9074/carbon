import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import moment from 'moment';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const HAProxyInfo = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');

    return (
      <DescriptionList>
        <DescriptionItem title='Version'>
          {data.get('info.version')}
        </DescriptionItem>
        <DescriptionItem title='Name'>
          {data.get('info.name')}
        </DescriptionItem>
        <DescriptionItem title='Started at'>
          {moment(data.get('info.startedAt')).format()}
        </DescriptionItem>
        <DescriptionItem title='Max Memory'>
          {data.get('info.memmax')}
        </DescriptionItem>
        <DescriptionItem title='Ulimit-n'>
          {data.get('info.ulimitN')}
        </DescriptionItem>
        <DescriptionItem title='Max Sockets'>
          {data.get('info.maxsock')}
        </DescriptionItem>
        <DescriptionItem title='Max Connections'>
          {data.get('info.maxconn')}
        </DescriptionItem>
        <DescriptionItem title='Max pipes'>
          {data.get('info.maxpipes')}
        </DescriptionItem>
        <DescriptionItem title='Session Rate Limit'>
          {data.get('info.sessRateLimit')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default HAProxyInfo;
