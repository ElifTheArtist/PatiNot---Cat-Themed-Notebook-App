import { useEffect, useMemo, useState } from 'react';
import useNotes from './hooks/useNotes.js';
import { CATEGORIES, filterNotes } from './utils/notes.js';
import NoteCard from './components/NoteCard.jsx';
import NoteEditor from './components/NoteEditor.jsx';
import DeleteDialog from './components/DeleteDialog.jsx';
import Icon from './components/Icon.jsx';

export default function App() {
  const { notes, warning, add, edit, remove, pin } = useNotes();
  const [view, setView] = useState('all');
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('updated');
  const [editor, setEditor] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);
  const visible = useMemo(() => filterNotes(notes, { view, category, query, sort }), [notes, view, category, query, sort]);
  const pinnedCount = notes.filter((note) => note.pinned).length;
  const activeFilters = Boolean(query.trim()) || category !== 'all' || view !== 'all';
  const title = category !== 'all' ? `${category} notların` : view === 'pinned' ? 'Sabitlenen notların' : 'Notların burada, rahatla.';
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(null), 3500); return () => window.clearTimeout(timer); }, [toast]);
  function announce(text) { setToast({ text, id: Date.now() }); }
  function selectView(nextView, nextCategory = 'all') { setView(nextView); setCategory(nextCategory); }
  function save(draft) {
    if (editor.note) { edit(editor.note.id, draft); announce('Notun güncellendi.'); }
    else { add(draft); announce('Yeni notun hazır.'); setQuery(''); setView('all'); setCategory('all'); }
    setEditor(null);
  }
  function clearFilters() { setQuery(''); setView('all'); setCategory('all'); }
  function discoverNote() {
    if (!notes.length) return;
    const chosen = notes[Math.floor(Math.random() * notes.length)];
    setEditor({ note: chosen });
  }

  return <div className="app-shell">
    <a className="skip-link" href="#notes-main">Notlara geç</a>
    <aside className="sidebar" aria-label="Not filtreleri">
      <a className="brand" href="#" onClick={(event) => { event.preventDefault(); clearFilters(); }} aria-label="PatiNot ana sayfa"><span className="brand-paw" aria-hidden="true">🐾</span><span>Pati<span className="brand-light">Not</span><small>KEDİLİ NOT DEFTERİM</small></span></a>
      <div className="sidebar-nav">
        <nav className="main-nav" aria-label="Not görünümleri">
          <button type="button" className={`nav-item ${view === 'all' && category === 'all' ? 'active' : ''}`} aria-current={view === 'all' && category === 'all' ? 'page' : undefined} onClick={() => selectView('all')}><Icon name="notes" /><span>Tüm notlar</span><span className="nav-count">{notes.length}</span></button>
          <button type="button" className={`nav-item ${view === 'pinned' ? 'active' : ''}`} aria-current={view === 'pinned' ? 'page' : undefined} onClick={() => selectView('pinned')}><Icon name="pin" /><span>Sabitlenenler</span><span className="nav-count">{pinnedCount}</span></button>
        </nav>
        <section className="categories"><h2>KATEGORİLER</h2><div className="category-nav">{CATEGORIES.map((item, index) => <button type="button" key={item} className={`nav-item ${category === item ? 'active' : ''}`} aria-pressed={category === item} onClick={() => selectView('all', item)}><span className={`category-dot dot-${index}`} aria-hidden="true" /><span>{item}</span><span className="nav-count">{notes.filter((note) => note.category === item).length}</span></button>)}</div></section>
      </div>
      <div className="sidebar-companion"><img src="/cat-mascot.png" alt="Mavi defterine sarılan krem ve şeftali renkli kedi" width="190" height="190" /><p>Küçük fikirler de<br />güzel başlangıçlardır.</p></div>
      <p className="storage-note">Notların bu tarayıcıda saklanır.<br />Verileri temizlemek notları siler.</p>
    </aside>

    <main id="notes-main" className="workspace">
      <header className="workspace-top"><p className="today">{new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}</p><span className="quiet-caption">Aklındakilere biraz yer aç.</span></header>
      <section className="workspace-heading"><div><span className="eyebrow">DÜŞÜNCELERİNE KÜÇÜK BİR YUVA</span><h1>{title}</h1><p>Bir fikir, bir ders notu ya da kendine küçük bir hatırlatma.</p></div><button type="button" className="button button-primary new-note-button" onClick={() => setEditor({ note: null })}><Icon name="plus" />Yeni not</button></section>
      {warning && <div className="storage-warning" role="alert">{warning}</div>}
      <section className="toolbar" aria-label="Not arama ve sıralama"><div className="search-field"><Icon name="search" size={19} /><label className="sr-only" htmlFor="notes-search">Notlarında ara</label><input id="notes-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Notlarında bir şey ara…" /></div><div className="sort-field"><label htmlFor="notes-sort">Sırala</label><select id="notes-sort" value={sort} onChange={(event) => setSort(event.target.value)}><option value="updated">Son düzenlenen</option><option value="title">Başlık A-Z</option></select></div></section>
      <div className="results-line"><p aria-live="polite">{visible.length} not{activeFilters ? ' gösteriliyor' : ''}{view === 'pinned' ? ' · Sabitlenenler' : ''}{category !== 'all' ? ` · ${category}` : ''}</p><div className="result-actions">{activeFilters && <button type="button" className="text-button" onClick={clearFilters}>Filtreleri temizle</button>}<button type="button" className="discovery-button" disabled={!notes.length} onClick={discoverNote} title="Kaydettiğin notlardan rastgele birini aç"><span aria-hidden="true">🐾</span> Bir pati izi keşfet</button></div></div>
      {visible.length ? <section className="notes-grid" aria-label="Not listesi">{visible.map((note) => <NoteCard key={note.id} note={note} onEdit={(item) => setEditor({ note: item })} onDelete={setDeleting} onPin={pin} />)}</section> : <section className="empty-state"><img src="/cat-mascot.png" alt="" width="160" height="160" /><h2>{activeFilters ? 'Bu köşede bir not bulamadık.' : 'Henüz bir pati izi bırakmadın.'}</h2><p>{activeFilters ? 'Başka bir kelime deneyebilir veya filtreleri temizleyebilirsin.' : 'İlk notunu ekle; fikirlerin kaybolmasın.'}</p><button type="button" className="button button-primary" onClick={activeFilters ? clearFilters : () => setEditor({ note: null })}>{activeFilters ? 'Tüm notları göster' : 'İlk notumu yaz'}</button></section>}
      <footer className="workspace-footer">Kendine bir not bırak. Gerisi biraz bekleyebilir.</footer>
    </main>
    {editor && <NoteEditor key={editor.note?.id ?? 'new'} note={editor.note} onSave={save} onClose={() => setEditor(null)} />}
    {deleting && <DeleteDialog note={deleting} onClose={() => setDeleting(null)} onConfirm={() => { remove(deleting.id); setDeleting(null); announce('Not silindi.'); }} />}
    <div className="toast-region" role="status" aria-live="polite">{toast && <div className="toast"><Icon name="check" size={18} />{toast.text}</div>}</div>
  </div>;
}
