import React from 'react';

import ClasspathLayouter from 'in-components/ClassPathLayouter/ClasspathLayouter';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {bytesTwoDecimalPlaces} from 'in-services/formatters/number';


export default function JVMInfo({snapshot}) {
  const data = snapshot.get('data');
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
}
