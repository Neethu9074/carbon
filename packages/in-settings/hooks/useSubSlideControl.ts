/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useState } from 'react';

import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';

export interface SlideControlProps<SUB_SLIDE_CONFIG_TYPE> {
  setSubSlideConfig: React.Dispatch<React.SetStateAction<SUB_SLIDE_CONFIG_TYPE | undefined>>;
  setShowSubSlide: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useSubSlideControl<SUB_SLIDE_CONFIG_TYPE extends SubSlideConfig>(
  initialSubSlideConfig?: SUB_SLIDE_CONFIG_TYPE,
  initialShowSubSlide: boolean = false
) {
  const [subSlideConfig, setSubSlideConfig] = useState<SUB_SLIDE_CONFIG_TYPE | undefined>(initialSubSlideConfig);
  const [showSubSlide, setShowSubSlide] = useState(initialShowSubSlide);

  return { subSlideConfig, setSubSlideConfig, showSubSlide, setShowSubSlide };
}
