interface Props {
  status: 'loading' | 'success' | 'error' | 'empty';
  message?: string;
}

const CONFIG = {
  loading: { className: 'banner--loading', defaultMessage: 'Chargement…' },
  success: { className: 'banner--success', defaultMessage: 'Opération réussie.' },
  error:   { className: 'banner--error',   defaultMessage: 'Une erreur est survenue.' },
  empty:   { className: 'banner--empty',   defaultMessage: 'Aucun résultat.' },
};

export default function StatusBanner({ status, message }: Props) {
  const { className, defaultMessage } = CONFIG[status];
  return (
    <div className={`banner ${className}`} role={status === 'error' ? 'alert' : 'status'}>
      {message ?? defaultMessage}
    </div>
  );
}
