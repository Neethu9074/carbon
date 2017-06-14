import React from 'react';
import { Redirect } from 'react-router-dom';

export default function RedirectWithHash(props) {
  const trimHash = () => {
    const hash = window.location.hash;
    return hash.substring(hash.indexOf('?'), hash.length);
  };

  const prepareProps = () => {
    return {
      ...props,
      to: `${props.to + trimHash()}`
    };
  };

  return <Redirect {...prepareProps()} />;
}
