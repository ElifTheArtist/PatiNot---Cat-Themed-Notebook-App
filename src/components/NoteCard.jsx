import Icon from './Icon.jsx';
import { CATS } from '../utils/notes.js';

export default function NoteCard({ note, onEdit, onDelete, onPin }) {
  const date = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short' }).format(new Date(note.updatedAt));
  const cat = CATS.find((item) => item.id === note.cat);
  return (
    <article className={`note-card note-${note.color}`}>
      <div className="note-topline"><span className="note-category">{note.category}</span>
        <button type="button" className={`icon-button pin-button ${note.pinned ? 'is-pinned' : ''}`} aria-label={note.pinned ? `${note.title} notunun sabitlemesini kaldır` : `${note.title} notunu sabitle`} aria-pressed={note.pinned} title={note.pinned ? 'Sabitlemeyi kaldır' : 'Sabitle'} onClick={() => onPin(note.id)}><Icon name="pin" size={18} /></button>
      </div>
      <button type="button" className="note-open" onClick={() => onEdit(note)} aria-label={`${note.title} notunu aç ve düzenle`}>
        {cat?.emoji && <span className="note-cat-stamp" role="img" aria-label={cat.label}>{cat.emoji}</span>}
        <h3>{note.title}</h3><p className="note-preview">{note.content || 'Bu notun içini küçük bir fikirle doldurabilirsin.'}</p>
      </button>
      <div className="note-bottomline"><time dateTime={note.updatedAt} title={new Date(note.updatedAt).toLocaleString('tr-TR')}>{date}</time><div className="note-actions">
        <button type="button" className="icon-button" aria-label={`${note.title} notunu düzenle`} title="Düzenle" onClick={() => onEdit(note)}><Icon name="edit" size={18} /></button>
        <button type="button" className="icon-button delete-button" aria-label={`${note.title} notunu sil`} title="Sil" onClick={() => onDelete(note)}><Icon name="trash" size={18} /></button>
      </div></div>
    </article>
  );
}
