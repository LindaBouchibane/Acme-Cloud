import { ModuleFields } from '@hubspot/cms-components/fields';
import { Island } from '@hubspot/cms-components';
import CatalogueIsland from '../../../islands/CatalogueIsland?island';

export function Component() {
  return (
    <section className="catalogue">
      <div className="container">
        <div className="catalogue__header">
          <h1 className="catalogue__title">Nos offres</h1>
          <p className="catalogue__subtitle">Découvrez nos outils SaaS pour booster votre productivité.</p>
        </div>
        <Island module={CatalogueIsland} hydrateOn="load" />
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
