import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

export default function DeleteDialog({ note, onConfirm, onClose }) {
  const ref = useRef(null);
  useEffect(() => { const el = ref.current; el.showModal(); return () => { if (el.open) el.close(); }; }, []);
  return <dialog ref={ref} className="delete-dialog" aria-labelledby="delete-title" onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <div className="delete-content"><span className="delete-symbol"><Icon name="trash" size={26} /></span><h2 id="delete-title">Bu not silinsin mi?</h2><p><strong>{note.title}</strong> adlı not kaldırılacak. Bu işlem geri alınamaz.</p><div className="dialog-footer"><button type="button" className="button button-quiet" onClick={onClose} autoFocus>Vazgeç</button><button type="button" className="button button-danger" onClick={onConfirm}>Evet, notu sil</button></div></div>
  </dialog>;
}
