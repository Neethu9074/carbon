import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import {formatDateTime} from 'in-services/formatters/date';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const HttpdInfo = React.createClass({
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
        <DescriptionItem title='Version'>
          {data.get('version')}
        </DescriptionItem>
        <DescriptionItem title='Architecture'>
          {data.get('architecture')}
        </DescriptionItem>
        <DescriptionItem title='Started at'>
          {formatDateTime(data.get('started_at'))}
        </DescriptionItem>
        <DescriptionItem title='Max workers'>
          {data.get('max_workers')}
        </DescriptionItem>
        <DescriptionItem title='MPM'>
          {data.get('mpm')}
        </DescriptionItem>
        <DescriptionItem title='Ports'>
          {data.get('ports', []).join(', ')}
        </DescriptionItem>
        <DescriptionItem title='Modules'>
          {data.get('modules', []).join(', ')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default HttpdInfo;
