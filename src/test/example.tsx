import { useState, useEffect } from 'react';
import useStore from './useStore';
import { MigrationStore, MigrationActions } from './migration_store';

const useSectionDisplayRules = () => {
  const migration = useStore(MigrationStore);
  const migrationData = migration.toJS();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MigrationActions.fetch().then(() => {
      setLoading(false);
      console.log("RESOLVED. LOADING?", loading);
    });
  }, []);

  const canShow = section_key => {
    if (loading) {
      return false;
    }

    return true;

    // if (section_key !== 'section_schedule_your_intro_call') {
    //   return true;
    // }

    // if (migrationData.previous_payroll_provider === 'QuickBooks Online') {
    //   return false;
    // }
  };

  return { canShow, loading };
};

export default useSectionDisplayRules;
