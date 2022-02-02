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
    });
  }, []);

  const canShow = section_key => {
    if (loading) { return false; }
    return true;
  };

  return { canShow, loading };
};

export default useSectionDisplayRules;
