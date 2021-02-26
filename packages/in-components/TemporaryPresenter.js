/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const TemporaryPresenter = React.memo(function TemporaryPresenter(props) {
  const [showChildren, setShowChildren] = useState(false);
  const [renderedForId, setRenderedForId] = useState(null);
  let timeout = null;

  useEffect(() => {
    return () => {
      stopTimeout();
    };
  }, []);

  useEffect(() => {
    onPropChange(props);
  }, [props, onPropChange]);

  function onPropChange(nextProps) {
    if (renderedForId === nextProps.id) {
      return;
    }

    stopTimeout();
    setShowChildren(true);
    setRenderedForId(nextProps.id);
    if (nextProps.duration) {
      timeout = setTimeout(hideChildren, nextProps.duration);
    }
  }

  function hideChildren() {
    setShowChildren(false);
    props?.onHide?.();
  }

  function stopTimeout() {
    clearTimeout(timeout);
  }

  if (showChildren && props.children) {
    return props.children;
  }
  return null;
});

TemporaryPresenter.propTypes = {
  id: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  onHide: PropTypes.func,
  children: PropTypes.object.isRequired
};

export default TemporaryPresenter;
