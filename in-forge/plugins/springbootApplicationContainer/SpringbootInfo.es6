import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {formatDateTime} from 'in-services/formatters/date';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const SpringbootInfo = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    const ports = data.get('ports');

    return (
      <DescriptionList>
        <DescriptionItem title='Name'>
          {data.get('name')}
        </DescriptionItem>
        <DescriptionItem title='Version'>
          {data.get('version')}
        </DescriptionItem>
        <DescriptionItem title='Springboot Version'>
          {data.get('springBootVersion')}
        </DescriptionItem>
        <DescriptionItem title='Started At'>
          {formatDateTime(data.get('startedAt'))}
        </DescriptionItem>
        <DescriptionItem title='Status'>
          {data.get('status')}
        </DescriptionItem>
        <DescriptionItem title='Port'>
          {ports ? ports.valueSeq().join(', ') : null}
        </DescriptionItem>
        <DescriptionItem title='HTTP Sessions Max'>
          {data.get('httpsessionsMax')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default SpringbootInfo;
