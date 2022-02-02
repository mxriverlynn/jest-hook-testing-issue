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
    it('cannot show any sections until loading is complete', async () => {
      const { result, waitFor } = renderHook(() => useSectionDisplayRules());

      expect(result.current.loading).toBe(true);
      expect(result.current.canShow(sectionName)).toBe(false);

      act(() => {
        fetchComplete();
      });

      // Promise resolution from `fetchComplete` happens asynchronously. We can
      // either wait until the next process tick and _then_ do our assertions
      // OR we can use `waitFor` (https://www.npmjs.com/package/wait-for-expect
      // wrapped in `act` and re-exported by testing-library) to try the
      // assertion a few times over the course of a couple process ticks.
      // Wherever possible (and it's not always possible), I think it's best to
      // prefer `waitFor` over explicit `setTimeout` calls, to make the test as
      // ignorant as possible of the internals of the implementation.
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      })

      expect(result.current.canShow(sectionName)).toBe(true);
    });
  });
});
