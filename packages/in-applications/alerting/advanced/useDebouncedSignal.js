import { create } from 'reactive-observables';
import { useState } from 'react';

import useObservable from 'in-hooks/useObservable';

export default function useDebouncedSignal() {
  const [debounceOnChange$] = useState(create({ emitLatestOnSubscribe: false }));
  useObservable(
    debounceOnChange$.debounce(300).tap(callback => callback()),
    []
  );
  return debounceOnChange$;
}
