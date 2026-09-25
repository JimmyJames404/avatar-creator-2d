import type { AvatarCategory } from '../types';

export function AvatarCategoryTabs({ categories, activeId, onChange }: { categories: AvatarCategory[]; activeId: string; onChange: (id: string) => void }) {
  return (
    <nav className="category-tabs" aria-label="Categorías del avatar">
      {categories.map((category) => (
        <button key={category.id} className={activeId === category.id ? 'is-active' : ''} onClick={() => onChange(category.id)} aria-current={activeId === category.id ? 'page' : undefined}>
          <span aria-hidden="true">{category.icon}</span>{category.label}
        </button>
      ))}
    </nav>
  );
}
