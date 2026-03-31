const API_BASE = "http://localhost:8000";

export async function uploadExcelFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error(`Erreur serveur ${res.status}`);
    return await res.json();
  } catch {
    return { success: false, message: "Backend non connecte. Mode demonstration." };
  }
}

export async function getCollectData() {
  try {
    const res = await fetch(`${API_BASE}/data/collect`);
    if (!res.ok) throw new Error(`Erreur serveur ${res.status}`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function getDashboardStats() {
  try {
    const res = await fetch(`${API_BASE}/data/dashboard`);
    if (!res.ok) throw new Error(`Erreur serveur ${res.status}`);
    return await res.json();
  } catch {
    return null;
  }
}
