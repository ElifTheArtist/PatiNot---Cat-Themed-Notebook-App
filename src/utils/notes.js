// Veriyi yöneten saf fonksiyonlar arayüzden ayrı tutulur.
export const STORAGE_KEY = 'patinot.notes.v1';
export const CATEGORIES = ['Kişisel', 'Ders', 'Fikir', 'Yapılacaklar'];
export const COLORS = [
  { id: 'cream', label: 'Krem' },
  { id: 'peach', label: 'Şeftali' },
  { id: 'blue', label: 'Pastel mavi' },
];
export const CATS = [
  { id: '', emoji: '', label: 'Kedisiz' },
  { id: 'curious', emoji: '😺', label: 'Meraklı kedy' },
  { id: 'cheerful', emoji: '😸', label: 'Neşeli kedy' },
  { id: 'loving', emoji: '😻', label: 'Sevgi dolu kedy' },
  { id: 'kiss', emoji: '😽', label: 'Öpücükçü kedy' },
];

export function validateDraft(draft) {
  if (typeof draft.title !== 'string' || !draft.title.trim()) {
    throw new Error('Notuna kısa bir başlık ekler misin?');
  }
  if (draft.title.trim().length > 100) throw new Error('Başlık en fazla 100 karakter olabilir.');
  if (typeof draft.content !== 'string' || draft.content.length > 6000) {
    throw new Error('Not içeriği en fazla 6000 karakter olabilir.');
  }
  return {
    title: draft.title.trim(),
    content: draft.content.trim(),
    category: CATEGORIES.includes(draft.category) ? draft.category : 'Kişisel',
    color: COLORS.some((color) => color.id === draft.color) ? draft.color : 'cream',
    cat: CATS.some((cat) => cat.id === draft.cat) ? draft.cat : '',
  };
}

export function createNote(draft, now = new Date().toISOString()) {
  const values = validateDraft(draft);
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return { ...values, id, pinned: false, createdAt: now, updatedAt: now };
}

export function updateNote(notes, id, draft, now = new Date().toISOString()) {
  if (!notes.some((note) => note.id === id)) throw new Error('Düzenlenecek not bulunamadı.');
  const values = validateDraft(draft);
  return notes.map((note) => note.id === id ? { ...note, ...values, updatedAt: now } : note);
}

export function deleteNote(notes, id) {
  return notes.filter((note) => note.id !== id);
}

export function togglePinned(notes, id) {
  return notes.map((note) => note.id === id ? { ...note, pinned: !note.pinned } : note);
}

// Türkçe I/İ aramalarını doğru eşleştirmek için yerel küçük harf dönüşümü.
export function filterNotes(notes, { view = 'all', category = 'all', query = '', sort = 'updated' } = {}) {
  const term = query.trim().toLocaleLowerCase('tr-TR');
  const filtered = notes.filter((note) => {
    if (view === 'pinned' && !note.pinned) return false;
    if (category !== 'all' && note.category !== category) return false;
    const text = `${note.title} ${note.content} ${note.category}`.toLocaleLowerCase('tr-TR');
    return !term || text.includes(term);
  });
  return filtered.sort((a, b) => {
    if (a.pinned !== b.pinned) return Number(b.pinned) - Number(a.pinned);
    if (sort === 'title') return a.title.localeCompare(b.title, 'tr-TR');
    return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  });
}

function isValidNote(note) {
  return note && typeof note.id === 'string' && note.id.length > 0
    && typeof note.title === 'string' && note.title.trim().length > 0 && note.title.length <= 100
    && typeof note.content === 'string' && note.content.length <= 6000
    && CATEGORIES.includes(note.category) && COLORS.some((color) => color.id === note.color)
    && typeof note.pinned === 'boolean'
    && (note.cat === undefined || CATS.some((cat) => cat.id === note.cat))
    && Number.isFinite(Date.parse(note.createdAt)) && Number.isFinite(Date.parse(note.updatedAt));
}

export function readNotes(storage, initialNotes = []) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    // Eksik kayıt ve kaydedilmiş boş liste farklıdır. Silinen notlar geri gelmez.
    if (raw === null) return { notes: initialNotes, warning: '' };
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1 || !Array.isArray(parsed.notes)
        || !parsed.notes.every(isValidNote)
        || new Set(parsed.notes.map((note) => note.id)).size !== parsed.notes.length) {
      throw new Error('invalid-data');
    }
    return { notes: parsed.notes.map((note) => ({ ...note, cat: note.cat ?? '' })), warning: '' };
  } catch {
    return { notes: [], warning: 'Kayıtlar okunamadı. Önceki kayıt otomatik olarak değiştirilmedi. Yeni kayıt yapmadan önce tarayıcı verilerini kontrol et.' };
  }
}

export function writeNotes(storage, notes) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, notes }));
    return '';
  } catch {
    return 'Tarayıcıya kaydedilemedi. Değişiklikler yalnızca bu açık oturumda duruyor. Sayfayı kapatmadan önce önemli notlarını kopyala.';
  }
}

export function makeDemoNotes() {
  const now = new Date().toISOString();
  return [
    { id: 'demo-welcome', cat: 'curious', title: 'PatiNot’a hoş geldin', content: 'Burası düşüncelerinin küçük yuvası. 🐾\n\nYeni not ekleyebilir, notlarını düzenleyebilir ve sevdiğin rengi seçebilirsin. İğne simgesi önemli notlarını en üste taşır.\n\nBu bir örnek not; dilediğin gibi düzenleyebilir veya silebilirsin.', category: 'Kişisel', color: 'peach', pinned: true, createdAt: now, updatedAt: now },
    { id: 'demo-study', cat: 'cheerful', title: 'Bu haftanın küçük hedefleri', content: '• Ders notlarını gözden geçir\n• Web projesine biraz zaman ayır\n• Bir fincan çay molası ver\n\nHepsini aynı anda yapmak zorunda değilsin.', category: 'Ders', color: 'blue', pinned: false, createdAt: now, updatedAt: now },
    { id: 'demo-idea', cat: 'loving', title: 'Aklıma gelenler', content: 'Bazen iyi bir fikir, tam başka bir şeyle uğraşırken gelir. Kaybolmadan buraya bırak.\n\nKüçük bir fikir de bir başlangıçtır.', category: 'Fikir', color: 'cream', pinned: false, createdAt: now, updatedAt: now },
  ];
}
