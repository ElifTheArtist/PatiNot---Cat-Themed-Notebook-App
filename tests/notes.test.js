import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STORAGE_KEY, createNote, updateNote, deleteNote, togglePinned, filterNotes, readNotes, writeNotes, makeDemoNotes, validateDraft } from '../src/utils/notes.js';

function memoryStorage(initial = null) {
  let value = initial;
  return { getItem: () => value, setItem: (_key, next) => { value = next; }, raw: () => value };
}
const base = { title: 'Bir fikir', content: 'Yarın yeniden bak.', category: 'Fikir', color: 'blue', cat: 'curious' };

test('Ekle, kediyle düzenle, sabitle ve sil: kayıt gidiş dönüşünde bilgiler korunur', () => {
  const storage = memoryStorage();
  const created = createNote(base, '2026-10-19T10:00:00.000Z');
  const other = createNote({ ...base, title: 'Diğer not', cat: '' });
  assert.notEqual(created.id, other.id);
  const original = [created, other];
  const changed = updateNote(original, created.id, { ...base, title: 'Düzenlenmiş fikir', cat: 'loving', color: 'peach' }, '2026-10-19T11:00:00.000Z');
  assert.equal(original[0].title, 'Bir fikir');
  assert.equal(changed[0].id, created.id);
  assert.equal(changed[0].createdAt, created.createdAt);
  assert.equal(changed[0].updatedAt, '2026-10-19T11:00:00.000Z');
  assert.equal(changed[0].cat, 'loving');
  const pinned = togglePinned(changed, created.id);
  assert.equal(pinned[0].pinned, true);
  assert.equal(writeNotes(storage, pinned), '');
  assert.deepEqual(readNotes(storage).notes, pinned);
  assert.deepEqual(deleteNote(pinned, created.id), [other]);
  assert.equal(pinned.length, 2);
});

test('Tüm notlar silindiğinde yeniden açmak örnek notları geri getirmez', () => {
  const storage = memoryStorage();
  const demo = makeDemoNotes();
  assert.equal(readNotes(storage, demo).notes.length, 3);
  assert.equal(storage.raw(), null);
  writeNotes(storage, []);
  assert.deepEqual(readNotes(storage, demo), { notes: [], warning: '' });
});

test('Kedi isteğe bağlıdır; dört seçenek ve eski kedisiz kayıtlar desteklenir', () => {
  for (const cat of ['', 'curious', 'cheerful', 'loving', 'kiss']) {
    const note = createNote({ ...base, cat });
    const storage = memoryStorage();
    writeNotes(storage, [note]);
    assert.equal(readNotes(storage).notes[0].cat, cat);
  }
  const note = createNote(base);
  delete note.cat;
  const stored = memoryStorage(JSON.stringify({ version: 1, notes: [note] }));
  assert.equal(readNotes(stored).notes[0].cat, '');
});

test('Türkçe arama, kategori ve sabitlenenler birlikte çalışır; sıralama kaynağı değiştirmez', () => {
  const a = createNote({ ...base, title: 'FİKİR DEFTERİ' });
  const b = createNote({ ...base, title: 'Ders', category: 'Ders' });
  const notes = [a, b];
  assert.equal(filterNotes(notes, { query: 'fikir' })[0].id, a.id);
  assert.equal(filterNotes(notes, { category: 'Ders', query: 'fikir' }).length, 0);
  assert.equal(filterNotes(notes, { view: 'pinned' }).length, 0);
  const pinned = togglePinned(notes, b.id);
  assert.equal(filterNotes(pinned)[0].id, b.id);
  assert.deepEqual(notes, [a, b]);
});

test('Bozuk kayıtlar sessizce üzerine yazılmaz; depolama hatası kullanıcıya bildirilir', () => {
  const raw = '{bozuk';
  const storage = memoryStorage(raw);
  assert.ok(readNotes(storage).warning);
  assert.equal(storage.raw(), raw);
  const bad = createNote(base);
  const duplicate = JSON.stringify({ version: 1, notes: [bad, bad] });
  assert.ok(readNotes(memoryStorage(duplicate)).warning);
  assert.ok(writeNotes({ setItem() { throw new Error('quota'); } }, [bad]));
  assert.equal(typeof STORAGE_KEY, 'string');
});

test('Boş ve aşırı uzun başlıklar reddedilir; bilinmeyen seçenekler güvenli varsayılana döner', () => {
  assert.throws(() => validateDraft({ ...base, title: '   ' }));
  assert.throws(() => validateDraft({ ...base, title: 'a'.repeat(101) }));
  assert.throws(() => validateDraft({ ...base, content: 'a'.repeat(6001) }));
  const values = validateDraft({ ...base, title: '  Başlık  ', cat: 'unknown', color: 'green' });
  assert.equal(values.title, 'Başlık');
  assert.equal(values.cat, '');
  assert.equal(values.color, 'cream');
});
