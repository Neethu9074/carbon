/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createContext } from 'react';

import { SloForm, SloFormOnChange } from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { createSloForm } from 'in-service-levels/components/ConfigDialog/createSloForm';

interface SloFormContextProps {
  form: SloForm;
  onChange: SloFormOnChange;
}

const defaultForm = createSloForm({ entityType: 'application' });

const defaultContext: SloFormContextProps = {
  form: defaultForm,
  onChange: defaultForm.updateIn
};

const SloFormContext = createContext<SloFormContextProps>(defaultContext);

export default SloFormContext;
