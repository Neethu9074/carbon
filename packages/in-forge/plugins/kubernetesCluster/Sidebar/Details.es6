import React from 'react';

import Sidebar from '../Dashboard/Sidebar';

export default function Details(props) {
  return <Sidebar {...props} linkToDashboards={false} />;
}
