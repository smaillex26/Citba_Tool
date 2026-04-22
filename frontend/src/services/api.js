/**
 * Tous les appels passent par /api (proxy Vite → http://localhost:8000).
 * Si le backend n'est pas lancé, les pages continuent d'afficher
 * les données mock JS — aucune erreur bloquante.
 */

async function apiFetch(path, options = {}) {
  const res = await fetch(`/api${path}`, options);
  if (!res.ok) throw new Error(`Erreur ${res.status} sur ${path}`);
  return res.json();
}

// ── Upload ────────────────────────────────────────────────────────────────────

/**
 * Envoie un fichier Excel au backend.
 * Retourne { job_id, status } ou { success: false, message } si hors ligne.
 */
export async function uploadExcelFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  try {
    return await apiFetch("/upload", { method: "POST", body: formData });
  } catch {
    return { success: false, message: "Backend non connecté. Mode démonstration." };
  }
}

/**
 * Interroge l'état d'un traitement en cours.
 * Retourne { status: "pending"|"processing"|"done"|"error" }.
 */
export async function getUploadStatus(jobId) {
  try {
    return await apiFetch(`/upload/status/${jobId}`);
  } catch {
    return null;
  }
}

// ── Données ───────────────────────────────────────────────────────────────────

/**
 * Récupère un jeu de données depuis le backend.
 * Retourne null si non disponible (backend éteint ou fichier non importé).
 *
 * @param {"energie"|"achats_biens"|"achats_services"|"biens_immobilises"
 *         |"deplacements_pro"|"dechets"|"transport_aval"
 *         |"sous_traitance"|"deplacements_dt"|"actifs_leasing"} dataset
 */
export async function getDataset(dataset) {
  try {
    return await apiFetch(`/data/${dataset}`);
  } catch {
    return null;
  }
}

/** Liste les datasets déjà disponibles côté backend. */
export async function listAvailableDatasets() {
  try {
    return await apiFetch("/data");
  } catch {
    return null;
  }
}

/** Vérifie que le backend est accessible. */
export async function checkHealth() {
  try {
    const res = await apiFetch("/health");
    return res.status === "ok";
  } catch {
    return false;
  }
}
