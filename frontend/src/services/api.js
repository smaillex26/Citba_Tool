/**
 * Tous les appels passent par /api (proxy Vite -> backend FastAPI local).
 */

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const TOKEN_KEY = "citba_auth_token";

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers ?? {});
  const token = getAuthToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`/api${path}`, { ...options, headers });
  if (!res.ok) {
    let detail = `Erreur ${res.status} sur ${path}`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      // La réponse n'est pas forcément JSON (proxy, serveur coupé, etc.).
    }
    throw new ApiError(detail, res.status);
  }
  return res.json();
}

export async function login(email, password) {
  try {
    const result = await apiFetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(result.token);
    return result;
  } catch (err) {
    return {
      success: false,
      message: err instanceof ApiError ? err.message : "Connexion impossible.",
    };
  }
}

export async function getCurrentUser() {
  if (!getAuthToken()) return null;
  try {
    return await apiFetch("/auth/me");
  } catch {
    clearAuthToken();
    return null;
  }
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
  } catch (err) {
    return {
      success: false,
      message: err instanceof ApiError
        ? err.message
        : "Backend non connecté. Lancez le serveur puis relancez l'import.",
    };
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

export async function listImports() {
  try {
    return await apiFetch("/imports");
  } catch {
    return null;
  }
}

export async function deleteImport(importId) {
  try {
    return await apiFetch(`/imports/${importId}`, { method: "DELETE" });
  } catch (err) {
    return {
      success: false,
      message: err instanceof ApiError ? err.message : "Impossible de supprimer cet import.",
    };
  }
}

// ── Données ───────────────────────────────────────────────────────────────────

/**
 * Récupère un jeu de données depuis le backend.
 * Retourne null si non disponible (backend éteint ou fichier non importé).
 *
 * @param {"energie"|"clim"|"achats_biens"|"achats_services"|"biens_immobilises"
 *         |"deplacements_pro"|"dechets"|"transport_aval"
 *         |"sous_traitance"|"deplacements_dt"} dataset
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

export async function listEmissionFactors() {
  try {
    return await apiFetch("/emission-factors");
  } catch {
    return null;
  }
}

export async function saveEmissionFactor(factor) {
  const isUpdate = Boolean(factor.id);
  const path = isUpdate ? `/emission-factors/${factor.id}` : "/emission-factors";
  try {
    return await apiFetch(path, {
      method: isUpdate ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: factor.name,
        category: factor.category || null,
        unit: factor.unit || null,
        factor_kg_co2e: Number(factor.factor_kg_co2e),
        scope: factor.scope || null,
        source: factor.source || null,
        year: factor.year ? Number(factor.year) : null,
        comment: factor.comment || null,
        version: factor.version || "default",
        is_active: Boolean(factor.is_active),
      }),
    });
  } catch (err) {
    return {
      success: false,
      message: err instanceof ApiError ? err.message : "Impossible d'enregistrer ce facteur.",
    };
  }
}

export async function recalculateLatestImport() {
  try {
    return await apiFetch("/emission-factors/recalculate-latest", { method: "POST" });
  } catch (err) {
    return {
      success: false,
      message: err instanceof ApiError ? err.message : "Impossible de recalculer le dernier import.",
    };
  }
}

export function exportExcelUrl() {
  return "/api/exports/excel";
}

export function exportPdfUrl() {
  return "/api/exports/pdf";
}

export function importReportUrl(importId) {
  return `/api/exports/imports/${importId}/report`;
}

export async function getSettings() {
  try {
    return await apiFetch("/settings");
  } catch {
    return null;
  }
}

export function backupDownloadUrl() {
  return "/api/backup/download";
}

export async function restoreBackup(file) {
  const formData = new FormData();
  formData.append("file", file);
  try {
    return await apiFetch("/backup/restore", { method: "POST", body: formData });
  } catch (err) {
    return {
      success: false,
      message: err instanceof ApiError ? err.message : "Impossible de restaurer cette sauvegarde.",
    };
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
