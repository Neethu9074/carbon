import React from 'react';
import { Redirect } from 'react-router-dom';

export default function RedirectWithHash(props) {
  const prepareProps = () => {
    return {
      ...props,
      to: `${props.to + props.location.search}`
    };
  };

  return <Redirect {...prepareProps()} />;
}
