/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createContext } from 'react';
import { MapPath } from 'formalistic';

import type { GatewayFormSideEffectsReturnType } from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/hooks/useGatewayFormSideEffects';
import type {
  GatewayForm,
  GatewayFormItems
} from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/types/gatewayFormTypes';
import { createGatewayForm } from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/utils/formUtils';

export type GatewayFormOnChange = (path: MapPath<GatewayFormItems>, fn: any) => void;

export interface GatewayFormContextType {
  form: GatewayForm;
  mode: 'NEW' | 'EDIT';
  onChange: GatewayFormOnChange;
  setForm: (form: GatewayForm) => void;
  updateForm: GatewayFormSideEffectsReturnType;
}

const defaultForm = createGatewayForm({});

const GatewayFormContext = createContext<GatewayFormContextType>({
  form: defaultForm,
  mode: 'NEW',
  onChange: () => {},
  setForm: () => {},
  updateForm: () => {}
});

export default GatewayFormContext;
