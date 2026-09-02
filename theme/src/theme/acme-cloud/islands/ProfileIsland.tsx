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
      <div className="profile__header">
        <div className="profile__info">
          <h1>
            {contact.firstname} {contact.lastname}
          </h1>
          {contact.company && <p className="profile__company">{contact.company}</p>}
          <p className="profile__email">{contact.email}</p>
          <span className="profile__badge profile__badge--connected">Connecté</span>
        </div>
      </div>

      <div className="profile__edit">
        <h2>Modifier mon profil</h2>

        {formState === 'success' && (
          <StatusBanner status="success" message="Profil mis à jour avec succès." />
        )}
        {formState === 'error' && (
          <StatusBanner status="error" message={serverError} />
        )}

        <form onSubmit={handleSubmit} noValidate>
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
          <Button type="submit" variant="primary" loading={isLoading}>
            {isLoading ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </form>
      </div>
    </div>
  );
}
