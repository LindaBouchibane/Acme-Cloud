import { Island } from '@hubspot/cms-components';
import CatalogueIsland from '../../islands/CatalogueIsland';

export default function CatalogueList({ records = [] }) {
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
