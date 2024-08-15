/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';

const useUnsavedChangesPrompt = () => {
  const [isFormNotSaved, setIsFormNotSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [nextLocation, setNextLocation] = useState(null);
  const [action, setAction] = useState(null);
  const history = useHistory();
  useEffect(() => {
    const suspendNavigation = history.block((location, action) => {
      if (isFormNotSaved) {
        setNextLocation(location);
        setIsFormNotSaved(false);
        setAction(action);
        setShowModal(true);
        return false;
      }
      return true;
    });
    return () => {
      suspendNavigation();
    };
  }, [isFormNotSaved, history]);

  useEffect(() => {
    return () => {
      if (!showModal && nextLocation) {
        const navigate = () =>
          action === 'PUSH' ? history.push(nextLocation.pathname) : history.replace(nextLocation.pathname);
        navigate();
      }
    };
  }, [showModal, nextLocation, history]);

  const handleModalConfirmation = () => {
    setShowModal(false);
    setIsFormNotSaved(false);
  };
  const handleCancelNavigation = () => {
    setShowModal(false);
    setNextLocation(null);
  };
  return {
    showModal,
    setShowModal,
    setIsFormNotSaved,
    handleModalConfirmation,
    handleCancelNavigation
  };
};

export default useUnsavedChangesPrompt;
