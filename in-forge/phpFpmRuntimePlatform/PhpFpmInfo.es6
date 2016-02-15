import irpt from 'react-immutable-proptypes';
import React from 'react/addons';
import moment from 'moment';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-components/Collapsible';


const PhpFpmInfo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    const pools = data.get('worker_pools').toArray();

    return (
      <div>
        <DescriptionList>
          <DescriptionItem title='Master Process ID'>
            {data.get('pid')}
          </DescriptionItem>
        </DescriptionList>
          {pools.map(pool =>
            <Collapsible initiallyOpen={true} key={pool}>
              <Collapsible.Header>Worker Pool: {data.get('worker_pool.' + pool).get('pool')}</Collapsible.Header>
              <Collapsible.Content>
                <DescriptionList>
                  <DescriptionItem title='Process Manager'>
                    {data.get('worker_pool.' + pool).get('process_manager')}
                  </DescriptionItem>
                  <DescriptionItem title='Start Time'>
                    {moment.unix(data.get('worker_pool.' + pool).get('start_time')).format()}
                  </DescriptionItem>
                </DescriptionList>
              </Collapsible.Content>
            </Collapsible>
          )}
      </div>
    );
  }
});

export default PhpFpmInfo;
