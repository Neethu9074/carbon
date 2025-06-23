/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createContext } from 'react';

import {
  CorrectionWindowForm,
  CorrectionWindowFormOnChange
} from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/types';
import { ConfigureDialogMode } from 'in-service-levels/types';
import { createCorrectionWindowForm } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/createCorrectionWindowForm';
import { CorrectionWindowFormSideEffectsReturnType } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/hooks/useCorrectionWindowFormSideEffects';

interface CorrectionWindowFormContextProps {
  form: CorrectionWindowForm;
  mode: ConfigureDialogMode;
  onChange: CorrectionWindowFormOnChange;
  setForm: (form: CorrectionWindowForm) => void;
  updateForm: CorrectionWindowFormSideEffectsReturnType;
}

const defaultForm = createCorrectionWindowForm({});

const defaultContext: CorrectionWindowFormContextProps = {
  form: defaultForm,
  mode: 'NEW',
  onChange: defaultForm.updateIn,
  setForm: _form => {},
  updateForm: _form => {}
};

const CorrectionWindowFormContext = createContext<CorrectionWindowFormContextProps>(defaultContext);

export default CorrectionWindowFormContext;
