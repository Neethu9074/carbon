import irpt from 'react-immutable-proptypes';
import React from 'react';

import {timeframeShape} from 'in-stores/timeline';


export default function Ec2Dashboard({}) {
  return (
    <div/>
  );
}

Ec2Dashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
