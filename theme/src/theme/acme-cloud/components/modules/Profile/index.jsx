import { ModuleFields } from '@hubspot/cms-components/fields';
import { Island } from '@hubspot/cms-components';
import ProfileIsland from '../../../islands/ProfileIsland';

export function Component({ hublParameters }) {
  const { contactId, firstname, lastname, email, jobtitle, phone, company } =
    hublParameters ?? {};

  return (
    <section className="profile">
      <div className="container">
        <Island
          module={ProfileIsland}
          hydrateOn="load"
          contactId={contactId}
          initialData={{ firstname, lastname, email, jobtitle, phone, company }}
        />
      </div>
    </section>
  );
}

export const fields = (
  <ModuleFields />
);

export const meta = {
  label: 'Mon compte — Profil',
};
