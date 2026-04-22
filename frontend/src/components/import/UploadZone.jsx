import { useRef, useState } from "react";
import Button from "../ui/Button.jsx";

const ACCEPTED = ".xlsx,.xls";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
}

function UploadZone({ onFileSelected, status = "idle" }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFile(picked) {
    if (!picked) return;
    setFile(picked);
    if (onFileSelected) onFileSelected(picked);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleInputChange(e) {
    handleFile(e.target.files[0]);
  }

  function handleReset() {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
    if (onFileSelected) onFileSelected(null);
  }

  const zoneClass = [
    "upload-zone",
    dragOver ? "upload-zone--drag" : "",
    file ? "upload-zone--has-file" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const statusLabel = {
    idle: null,
    loading: "Lecture du fichier en cours...",
    success: "Fichier traité avec succès.",
    error: "Erreur lors du traitement.",
  };

  return (
    <div
      className={zoneClass}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="upload-zone__input"
        onChange={handleInputChange}
      />

      {!file ? (
        <div className="upload-zone__content">
          <p className="upload-zone__icon">+</p>
          <p className="upload-zone__title">
            Glissez votre fichier Excel ici
          </p>
          <p className="upload-zone__text">
            ou cliquez sur le bouton ci-dessous &mdash; formats .xlsx / .xls
          </p>
          <div className="upload-zone__actions">
            <Button
              variant="secondary"
              onClick={() => inputRef.current?.click()}
            >
              Choisir un fichier
            </Button>
          </div>
        </div>
      ) : (
        <div className="upload-zone__file-info">
          <div>
            <p className="upload-zone__filename">{file.name}</p>
            <p className="upload-zone__filesize">{formatSize(file.size)}</p>
          </div>
          <div className="upload-zone__actions">
            <Button variant="ghost" onClick={handleReset}>
              Retirer
            </Button>
          </div>
        </div>
      )}

      {statusLabel[status] && (
        <p className={`upload-zone__status upload-zone__status--${status}`}>
          {statusLabel[status]}
        </p>
      )}
    </div>
  );
}

export default UploadZone;
