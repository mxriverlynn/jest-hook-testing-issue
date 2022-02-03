import { useState, useEffect } from 'react';
import useStore from './useStore';
import { MigrationStore, MigrationActions } from './migration_store';

const providers = ['QuickBooks Online', 'Intuit Online Payroll'];

const useSectionDisplayRules = () => {
  const migration = useStore(MigrationStore);
  const migrationData = migration.toJS();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MigrationActions.fetch().then(() => {
      setLoading(false);
    });
  }, []);

  const canShow = (section_key: string) => {
    if (loading) {
      return false;
    }

    const isIntroCall = section_key === 'section_schedule_your_intro_call';
    const isProvider = providers.includes(migrationData.previous_payroll_provider);
    const isInvite = migrationData.how_do_you_want_us_to_sign_in_to_your_account === 'admin';

    if (isIntroCall && isProvider && isInvite) {
      return false;
    }

    return true;
  };

  return { canShow, loading };
};

export default useSectionDisplayRules;
