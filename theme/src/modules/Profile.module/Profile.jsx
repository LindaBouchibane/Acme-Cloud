import { Island } from '@hubspot/cms-components';
import ProfileIsland from '../../islands/ProfileIsland';

export default function Profile({
  contactId,
  firstname,
  lastname,
  email,
  jobtitle,
  phone,
  company,
}) {
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
