import { buttonVariants } from '../ui/buttonVariants';

export type EventFilter = 'all' | 'joined' | 'mine';

const FILTERS: { key: EventFilter; label: string }[] = [
  { key: 'all', label: 'Tutti' },
  { key: 'joined', label: 'Partecipo' },
  { key: 'mine', label: 'Miei' },
];

interface EventFiltersProps {
  active: EventFilter;
  onChange: (filter: EventFilter) => void;
}

export function EventFilters({ active, onChange }: EventFiltersProps) {
  return (
    <nav className="flex w-full items-center justify-center gap-3 pt-4.5">
      {FILTERS.map((filter) => (
        <button
          key={filter.key}
          type="button"
          onClick={() => onChange(filter.key)}
          className={buttonVariants(active === filter.key ? 'outline' : 'secondary', 'w-full')}
        >
          {filter.label}
        </button>
      ))}
    </nav>
  );
}