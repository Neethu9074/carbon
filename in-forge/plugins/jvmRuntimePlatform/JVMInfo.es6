import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {bytesTwoDecimalPlaces} from 'in-services/formatters/number';

import ClasspathLayouter from './ClasspathLayouter';

const JVMInfo = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    const maxMemory = data.get('memory.max');

    return (
      <div>
        <DescriptionList>
          <DescriptionItem title='Java Version'>
            {data.get('jvm.version')}{' '}
            {data.get('jvm.build')}
          </DescriptionItem>

          <DescriptionItem title='Java Runtime'>
            {data.get('jvm.vendor')}<br/>
            {data.get('jvm.name')}
          </DescriptionItem>

          {maxMemory ?
            <DescriptionItem title='Maximum Heap'>
              {bytesTwoDecimalPlaces(maxMemory)}
            </DescriptionItem> :
            null
          }
        </DescriptionList>

        <ClasspathLayouter classpath={data.get('jvm.cp')}/>
      </div>
    );
  }});

export default JVMInfo;
