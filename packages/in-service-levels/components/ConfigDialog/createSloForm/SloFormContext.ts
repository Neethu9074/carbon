/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createContext } from 'react';

import {
  CreateSloDialogMode,
  SloForm,
  SloFormOnChange
} from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { createSloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/createSloForm';

interface SloFormContextProps {
  form: SloForm;
  mode: CreateSloDialogMode;
  onChange: SloFormOnChange;
  setForm: (form: SloForm) => void;
}

const defaultForm = createSloForm({ entityType: 'application' });

const defaultContext: SloFormContextProps = {
  form: defaultForm,
  mode: 'NEW',
  onChange: defaultForm.updateIn,
  setForm: _form => {}
};

const SloFormContext = createContext<SloFormContextProps>(defaultContext);

export default SloFormContext;
