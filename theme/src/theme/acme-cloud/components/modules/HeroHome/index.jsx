import {
  ModuleFields,
  TextField,
  UrlField,
  RepeatedFieldGroup,
} from '@hubspot/cms-components/fields';

export function Component({ fieldValues }) {
  const { title, subtitle, arguments: args = [], cta_label, cta_url } = fieldValues;
  const ctaHref = cta_url?.href ?? '/offres';

  return (
    <section className="hero">
      <div className="container">
        <h1 className="hero__title">{title}</h1>
        <p className="hero__subtitle">{subtitle}</p>

        {args.length > 0 && (
          <ul className="hero__arguments">
            {args.map((arg, i) => (
              <li key={i} className="hero__argument">
                <strong>{arg.arg_label}</strong>
                <span>{arg.arg_description}</span>
              </li>
            ))}
          </ul>
        )}

        {cta_label && (
          <a href={ctaHref} className="btn btn--primary">
            {cta_label}
          </a>
        )}
      </div>
    </section>
  );
}

export const fields = (
  <ModuleFields>
    <TextField
      name="title"
      label="Titre principal"
      default="La plateforme cloud pensée pour votre entreprise"
      required
    />
    <TextField
      name="subtitle"
      label="Sous-titre"
      default="Sécurité, performance et scalabilité — sans compromis."
    />
    <RepeatedFieldGroup
      name="arguments"
      label="Arguments (3 max)"
      occurrence={{ min: 1, max: 3, default: 3 }}
    >
      <TextField name="arg_label" label="Titre" default="Argument" />
      <TextField name="arg_description" label="Description" default="Décrivez l'avantage clé." />
    </RepeatedFieldGroup>
    <TextField name="cta_label" label="Texte du bouton" default="Découvrir nos offres" />
    <UrlField
      name="cta_url"
      label="URL du bouton"
      default={{ href: '/offres-linda', type: 'EXTERNAL', content_id: null }}
    />
  </ModuleFields>
);

export const meta = {
  label: 'Hero Accueil',
};
