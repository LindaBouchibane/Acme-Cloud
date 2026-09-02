import { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import StatusBanner from '../components/ui/StatusBanner';

interface ContactData {
  firstname: string;
  lastname: string;
  email: string;
  jobtitle: string;
  phone: string;
  company: string;
}

interface Props {
  contactId: string;
  initialData: ContactData;
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

interface FormErrors {
  firstname?: string;
  lastname?: string;
  phone?: string;
}

function validate(fields: Partial<ContactData>): FormErrors {
  const errors: FormErrors = {};
  if (!fields.firstname?.trim()) errors.firstname = 'Le prénom est requis.';
  if (!fields.lastname?.trim()) errors.lastname = 'Le nom est requis.';
  if (fields.phone && !/^[+\d\s\-().]{7,}$/.test(fields.phone)) {
    errors.phone = 'Numéro de téléphone invalide.';
  }
  return errors;
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

export default function ProfileIsland({ contactId, initialData }: Props) {
  const [contact, setContact] = useState<ContactData>(initialData);
  const [form, setForm] = useState({
    firstname: initialData.firstname ?? '',
    lastname: initialData.lastname ?? '',
    jobtitle: initialData.jobtitle ?? '',
    phone: initialData.phone ?? '',
  });
  const [formState, setFormState] = useState<FormState>('idle');
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const initials = [contact.firstname?.[0], contact.lastname?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase() || '?';

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setFormState('loading');
    setServerError('');

    try {
      const res = await fetch('/hs/serverless/updateProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId, ...form }),
      });

      const data = await res.json();

      if (data.success) {
        setContact((prev) => ({ ...prev, ...data.contact }));
        setForm((prev) => ({ ...prev, ...data.contact }));
        setFormState('success');
      } else {
        setServerError(data.error ?? 'Une erreur est survenue.');
        setFormState('error');
      }
    } catch {
      setServerError('Impossible de joindre le serveur.');
      setFormState('error');
    }
  }

  const isLoading = formState === 'loading';

  return (
    <div className="profile__island">
      <div className="profile__layout">

        {/* Sidebar — identity card */}
        <aside className="profile__sidebar">
          <div className="profile__avatar">{initials}</div>
          <h1 className="profile__name">
            {contact.firstname} {contact.lastname}
          </h1>
          {contact.jobtitle && (
            <p className="profile__jobtitle">{contact.jobtitle}</p>
          )}
          {contact.company && (
            <p className="profile__company">{contact.company}</p>
          )}

          <div className="profile__divider" />

          <div className="profile__meta">
            <div className="profile__meta-item">
              <span className="profile__meta-label">Email</span>
              <span className="profile__meta-value">{contact.email}</span>
            </div>
            {contact.phone && (
              <div className="profile__meta-item">
                <span className="profile__meta-label">Téléphone</span>
                <span className="profile__meta-value">{contact.phone}</span>
              </div>
            )}
          </div>

          <span className="profile__badge profile__badge--connected">Connecté</span>
        </aside>

        {/* Main — edit form */}
        <main className="profile__main">
          <div className="profile__edit">
            <div className="profile__edit-header">
              <div className="profile__edit-icon">
                <EditIcon />
              </div>
              <h2>Modifier mon profil</h2>
            </div>

            {formState === 'success' && (
              <StatusBanner status="success" message="Profil mis à jour avec succès." />
            )}
            {formState === 'error' && (
              <StatusBanner status="error" message={serverError} />
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="profile__form-grid">
                <Input
                  label="Prénom"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  error={errors.firstname}
                  disabled={isLoading}
                  required
                />
                <Input
                  label="Nom"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  error={errors.lastname}
                  disabled={isLoading}
                  required
                />
                <Input
                  label="Poste"
                  name="jobtitle"
                  value={form.jobtitle}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <Input
                  label="Téléphone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" variant="primary" loading={isLoading}>
                {isLoading ? 'Enregistrement…' : 'Enregistrer les modifications'}
              </Button>
            </form>
          </div>
        </main>

      </div>
    </div>
  );
}
