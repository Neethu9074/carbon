import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import moment from 'moment';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const PhpFpmInfo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

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
        <DescriptionItem title='Pool Name'>
          {data.get('pool')}
        </DescriptionItem>
        <DescriptionItem title='Process Manager'>
          {data.get('process manager')}
        </DescriptionItem>
        <DescriptionItem title='Start Time'>
          {moment.unix(data.get('start time')).format()}
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default PhpFpmInfo;
