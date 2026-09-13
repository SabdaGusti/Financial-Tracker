import { useState } from "react";
import { MoreVertical, Pencil, Archive, ArchiveRestore, Trash2 } from "lucide-react";
import BottomSheet from "../common/BottomSheet";
import IconButton from "../common/IconButton";

export default function AccountMenu({ account, onEdit, onArchive, onUnarchive, onDelete }) {
  const [open, setOpen] = useState(false);
  const isArchived = account.status === "archived";

  function handle(action) {
    setOpen(false);
    action();
  }

  return (
    <>
      <IconButton icon={MoreVertical} onClick={() => setOpen(true)} />
      <BottomSheet open={open} onClose={() => setOpen(false)} title={account.name}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ justifyContent: "flex-start" }}
            onClick={() => handle(onEdit)}
          >
            <Pencil size={17} /> Edit Account
          </button>
          {isArchived ? (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ justifyContent: "flex-start" }}
              onClick={() => handle(onUnarchive)}
            >
              <ArchiveRestore size={17} /> Aktifkan Kembali
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ justifyContent: "flex-start" }}
              onClick={() => handle(onArchive)}
            >
              <Archive size={17} /> Arsipkan Account
            </button>
          )}
          <button
            type="button"
            className="btn btn-danger"
            style={{ justifyContent: "flex-start" }}
            onClick={() => handle(onDelete)}
          >
            <Trash2 size={17} /> Hapus Account
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
