import React from 'react';

import {serverTime} from 'in-stores/serverTime';
import connectTo from 'in-hoc/connectTo';


export default connectTo({
  _serverTime: serverTime
}, function ServerTime({_serverTime, format, offset}) {
  return (
    <span>
      {format(_serverTime + offset)}
    </span>
  );
});
