import { renderHook, act } from '@testing-library/react-hooks';
import { MigrationActions } from './migration_store';

import useSectionDisplayRules from './example';

jest.mock('./useStore', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      return {
        toJS() {},
      };
    }),
  };
});

jest.mock('./migration_store', () => {
  return {
    __esModule: true,
    MigrationActions: {
      fetch: jest.fn(() => {}),
    },
  };
});

describe('useSectionDisplayRules', () => {
  let fetchComplete: any;
  const sectionName = 'section_schedule_your_intro_call';

  beforeEach(() => {
    const actionPromise = new Promise((r) => {
      fetchComplete = r;
    });

    MigrationActions.fetch.mockImplementation(() => {
      return actionPromise;
    });
  });

  describe('loading', () => {
    it('cannot show any sections until loading is complete', () => {
      const { result } = renderHook(() => useSectionDisplayRules());

      expect(result.current.loading).toBe(true);
      expect(result.current.canShow(sectionName)).toBe(false);

      act(() => {
        fetchComplete();
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.canShow(sectionName)).toBe(true);
    });
  });
});
