import { useState, useEffect, useMemo } from 'react';
import StatusBanner from '../components/ui/StatusBanner';

interface Offer {
  id: string;
  name: string;
  description: string;
  price: number | null;
  category: string;
}

type Status = 'loading' | 'loaded' | 'error';

export default function CatalogueIsland() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  useEffect(() => {
    try {
      const el = document.getElementById('acme-catalogue-data');
      if (!el?.textContent) throw new Error('no data');
      const data = JSON.parse(el.textContent);
      setOffers(Array.isArray(data) ? data : []);
      setStatus('loaded');
    } catch {
      setStatus('error');
    }
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(offers.map((r) => r.category).filter(Boolean))),
    [offers]
  );

  const filtered = useMemo(() => {
    return offers.filter((r) => {
      const matchesSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || r.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [offers, search, selectedCategory]);

  if (status === 'loading') {
    return <StatusBanner status="loading" message="Chargement des offres…" />;
  }

  if (status === 'error') {
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
        <p className="catalogue__description">{selectedOffer.description}</p>
        {selectedOffer.price !== null && (
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
            <li key={offer.id} className="catalogue__card">
              <h3>{offer.name}</h3>
              {offer.category && (
                <span className="catalogue__badge">{offer.category}</span>
              )}
              <p>{offer.description}</p>
              {offer.price !== null && (
                <p className="catalogue__price">{offer.price} €/mois</p>
              )}
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
