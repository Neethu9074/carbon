import irpt from 'react-immutable-proptypes';
import React from 'react';


export default function UnknownServiceSidebar() {
  return (
    <div/>
  );
}

UnknownServiceSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
