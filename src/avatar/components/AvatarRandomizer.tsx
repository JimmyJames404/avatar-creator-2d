export function AvatarRandomizer({ onCategory, onAll }: { onCategory: () => void; onAll: () => void }) {
  return (
    <div className="random-actions">
      <button className="secondary-button" onClick={onCategory}><span aria-hidden="true">↻</span> Esta categoría</button>
      <button className="secondary-button" onClick={onAll}><span aria-hidden="true">⚄</span> Todo aleatorio</button>
    </div>
  );
}
