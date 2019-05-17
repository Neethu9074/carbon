import { debouncedResize$ } from 'in-services/browser';
import connectTo from 'in-hoc/connectTo';

export const showAllColumns = 'all';
export const showMinimalColumns = 'minimal';

export const getResponsiveNavigatorMode = connectTo({
  navigatorMode: debouncedResize$
    .startWith(true)
    .map(() => {
      const width = window.innerWidth;
      if (width > 1680) {
        return showAllColumns;
      }
      return showMinimalColumns;
    })
    .distinct()
});
