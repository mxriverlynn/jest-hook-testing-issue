import { renderHook, act } from '@testing-library/react-hooks';
import { MigrationActions } from './migration_store';
import useSectionDisplayRules from './example';
import useStore from './useStore';

jest.mock('./useStore', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {}),
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
  let actionPromise: any;
  let fetchComplete: any;
  let sectionKey: string;
  let payrollProvider: string;
  let accessMethod: string;

  beforeEach(() => {
    sectionKey = 'some_random_section_key';
    payrollProvider = 'some random provider';
    accessMethod = 'share_access';
  });

  const resolveDataLoading = async () => {
    fetchComplete();
    return actionPromise;
  };

  const runHook = async (options: { resolve: boolean } = {}) => {
    actionPromise = new Promise(resolve => {
      fetchComplete = resolve;
    });

    MigrationActions.fetch.mockImplementation(() => actionPromise);

    useStore.mockImplementation(() => {
      return {
        toJS() {
          return {
            previous_payroll_provider: payrollProvider,
            how_do_you_want_us_to_sign_in_to_your_account: accessMethod,
          };
        },
      };
    });

    const displayRules = renderHook(() => useSectionDisplayRules());

    if (options.resolve) {
      await act(resolveDataLoading);
    }

    return displayRules;
  };

  describe('loading', () => {
    it('cannot show any sections until loading is complete', async () => {
      const { result } = await runHook();

      expect(result.current.loading).toBe(true);
      expect(result.current.canShow(sectionKey)).toBe(false);

      await act(resolveDataLoading);

      expect(result.current.loading).toBe(false);
      expect(result.current.canShow(sectionKey)).toBe(true);
    });
  });

  describe('schedule intro call section check', () => {
    beforeEach(() => {
      sectionKey = 'section_schedule_your_intro_call';
    });

    describe('when previous provider is QuickBooks Online', () => {
      beforeEach(() => {
        payrollProvider = 'QuickBooks Online';
      });

      describe('access method includes credentials', () => {
        beforeEach(() => {
          accessMethod = 'share_access';
        });

        it('can show the section', async () => {
          const { result } = await runHook({ resolve: true });

          expect(result.current.loading).toBe(false);
          expect(result.current.canShow(sectionKey)).toBe(true);
        });
      });

      describe('and access method is set to add gusto as an admin', () => {
        beforeEach(() => {
          accessMethod = 'admin';
        });

        it('cannot show the section', async () => {
          const { result } = await runHook({ resolve: true });

          expect(result.current.loading).toBe(false);
          expect(result.current.canShow(sectionKey)).toBe(false);
        });
      });
    });

    describe('when previous provider is Intuit Online Payroll', () => {
      beforeEach(() => {
        payrollProvider = 'Intuit Online Payroll';
      });

      describe('access method includes credentials', () => {
        beforeEach(() => {
          accessMethod = 'share_access';
        });

        it('can show the section', async () => {
          const { result } = await runHook({ resolve: true });

          expect(result.current.loading).toBe(false);
          expect(result.current.canShow(sectionKey)).toBe(true);
        });
      });

      describe('and access method is set to add gusto as an admin', () => {
        beforeEach(() => {
          accessMethod = 'admin';
        });

        it('cannot show the section', async () => {
          const { result } = await runHook({ resolve: true });

          expect(result.current.loading).toBe(false);
          expect(result.current.canShow(sectionKey)).toBe(false);
        });
      });
    });
  });
});
