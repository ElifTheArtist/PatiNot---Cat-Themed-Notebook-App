import { useEffect, useRef, useState } from 'react';
import { CATEGORIES, COLORS, CATS, validateDraft } from '../utils/notes.js';
import Icon from './Icon.jsx';

export default function NoteEditor({ note, onSave, onClose }) {
  const dialog = useRef(null);
  const initial = { title: note?.title ?? '', content: note?.content ?? '', category: note?.category ?? 'Kişisel', color: note?.color ?? 'cream', cat: note?.cat ?? '' };
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => { const element = dialog.current; element.showModal(); return () => { if (element.open) element.close(); }; }, []);
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  function close() {
    if (!dirty || window.confirm('Kaydedilmeyen değişiklikler var. Yine de kapatılsın mı?')) onClose();
  }
  function submit(event) {
    event.preventDefault();
    if (saving) return;
    try { const values = validateDraft(draft); setSaving(true); onSave(values); }
    catch (problem) { setError(problem.message); setSaving(false); }
  }
  const field = (name) => (event) => setDraft({ ...draft, [name]: event.target.value });
  return <dialog ref={dialog} className="editor-dialog" aria-labelledby="editor-title" onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
    <form onSubmit={submit} className={`editor-body editor-${draft.color}`}>
      <div className="dialog-header"><div><span className="eyebrow">KÜÇÜK BİR PATİ İZİ</span><h2 id="editor-title">{note ? 'Notunu düzenle' : 'Yeni bir not'}</h2></div><button type="button" className="icon-button" aria-label="Not penceresini kapat" onClick={close}><Icon name="close" /></button></div>
      <fieldset className="cat-picker"><legend>Notunun kedysi <span className="required-label">(isteğe bağlı)</span></legend><div className="cat-options">{CATS.map((cat) => <label key={cat.id} className={`cat-option ${draft.cat === cat.id ? 'selected' : ''}`} title={cat.label}><input type="radio" name="cat" value={cat.id} checked={draft.cat === cat.id} onChange={field('cat')} /><span aria-hidden="true">{cat.emoji || '—'}</span><span className="cat-choice-label">{cat.label.replace(' kedy', '')}</span></label>)}</div></fieldset>
      <label htmlFor="note-title">Başlık <span className="required-label">(zorunlu)</span></label>
      <input id="note-title" autoFocus value={draft.title} onChange={field('title')} maxLength={100} placeholder="Aklından ne geçiyor?" required />
      <label htmlFor="note-content">Notun</label>
      <textarea id="note-content" value={draft.content} onChange={field('content')} maxLength={6000} placeholder="Bir fikir, bir liste, kendine küçük bir hatırlatma…" rows={9} />
      <div className="character-count">{draft.content.length} / 6000</div>
      <div className="editor-options"><div className="category-field"><label htmlFor="note-category">Kategori</label><select id="note-category" value={draft.category} onChange={field('category')}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></div>
        <fieldset className="color-picker"><legend>Not rengi</legend><div>{COLORS.map((color) => <label key={color.id} className={`color-swatch swatch-${color.id} ${draft.color === color.id ? 'selected' : ''}`} title={color.label}><input type="radio" name="color" value={color.id} checked={draft.color === color.id} onChange={field('color')} aria-label={color.label} />{draft.color === color.id && <Icon name="check" size={17} />}</label>)}</div></fieldset>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="dialog-footer"><button type="button" className="button button-quiet" onClick={close}>Vazgeç</button><button className="button button-primary" type="submit" disabled={saving}><Icon name="check" size={18} />{note ? 'Değişiklikleri kaydet' : 'Notu kaydet'}</button></div>
    </form>
  </dialog>;
}
