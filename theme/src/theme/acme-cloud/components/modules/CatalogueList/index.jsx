import { ModuleFields } from '@hubspot/cms-components/fields';
import { Island } from '@hubspot/cms-components';
import CatalogueIsland from '../../../islands/CatalogueIsland';

export function Component({ hublParameters }) {
  const records = hublParameters?.records ?? [];

  return (
    <section className="catalogue">
      <div className="container">
        <h1 className="catalogue__title">Nos offres</h1>
        <Island
          module={CatalogueIsland}
          hydrateOn="load"
          initialRecords={records}
        />
      </div>
    </section>
  );
}

export const fields = (
  <ModuleFields />
);

export const meta = {
  label: 'Catalogue des offres',
};
