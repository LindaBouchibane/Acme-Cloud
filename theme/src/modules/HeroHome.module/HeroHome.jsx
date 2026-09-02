import { Island } from '@hubspot/cms-components';

export default function HeroHome({ title, subtitle, arguments: args = [], ctaLabel, ctaUrl }) {
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

        {ctaLabel && ctaUrl && (
          <a href={ctaUrl} className="btn btn--primary">
            {ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}
