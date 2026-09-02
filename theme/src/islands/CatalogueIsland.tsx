import { useState, useMemo } from 'react';
import StatusBanner from '../components/StatusBanner';

interface Offer {
  hs_object_id: string;
  name: string;
  description__plain_text_: string;
  price: string;
  category: string;
}

interface Props {
  initialRecords: Offer[];
}

export default function CatalogueIsland({ initialRecords }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(initialRecords.map((r) => r.category).filter(Boolean))),
    [initialRecords]
  );

  const filtered = useMemo(() => {
    return initialRecords.filter((r) => {
      const matchesSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description__plain_text_.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || r.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialRecords, search, selectedCategory]);

  if (!initialRecords) {
    return <StatusBanner status="error" message="Impossible de charger les offres." />;
  }

  if (selectedOffer) {
    return (
      <div className="catalogue__detail">
        <button className="btn btn--secondary" onClick={() => setSelectedOffer(null)}>
          ← Retour aux offres
        </button>
        <h2>{selectedOffer.name}</h2>
        {selectedOffer.category && (
          <span className="catalogue__badge">{selectedOffer.category}</span>
        )}
        <p className="catalogue__description">{selectedOffer.description__plain_text_}</p>
        {selectedOffer.price && (
          <p className="catalogue__price">À partir de {selectedOffer.price} €/mois</p>
        )}
      </div>
    );
  }

  return (
    <div className="catalogue__island">
      <div className="catalogue__filters">
        <input
          className="input"
          type="text"
          placeholder="Rechercher une offre…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {categories.length > 0 && (
          <select
            className="input"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <StatusBanner status="empty" message="Aucune offre ne correspond à votre recherche." />
      ) : (
        <ul className="catalogue__list">
          {filtered.map((offer) => (
            <li key={offer.hs_object_id} className="catalogue__card">
              <h3>{offer.name}</h3>
              {offer.category && (
                <span className="catalogue__badge">{offer.category}</span>
              )}
              <p>{offer.description__plain_text_}</p>
              {offer.price && <p className="catalogue__price">{offer.price} €/mois</p>}
              <button
                className="btn btn--secondary"
                onClick={() => setSelectedOffer(offer)}
              >
                Voir le détail
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
