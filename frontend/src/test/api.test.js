import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  uploadExcelFile,
  getUploadStatus,
  getDataset,
  checkHealth,
} from '../services/api.js'

// ── Utilitaire : mock fetch global ─────────────────────────────────────────

function mockFetch(body, ok = true, status = 200) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  })
}

beforeEach(() => {
  vi.restoreAllMocks()
})

// ── checkHealth ─────────────────────────────────────────────────────────────

describe('checkHealth', () => {
  it('retourne true si le backend répond ok', async () => {
    mockFetch({ status: 'ok' })
    expect(await checkHealth()).toBe(true)
  })

  it('retourne false si le backend est injoignable', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
    expect(await checkHealth()).toBe(false)
  })
})

// ── uploadExcelFile ─────────────────────────────────────────────────────────

describe('uploadExcelFile', () => {
  it('retourne job_id si le backend accepte le fichier', async () => {
    mockFetch({ job_id: 'abc-123', status: 'pending' })
    const file = new File(['data'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const result = await uploadExcelFile(file)
    expect(result.job_id).toBe('abc-123')
    expect(fetch).toHaveBeenCalledWith('/api/upload', expect.objectContaining({ method: 'POST' }))
  })

  it('retourne success:false si le backend est injoignable', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
    const file = new File(['data'], 'test.xlsx')
    const result = await uploadExcelFile(file)
    expect(result.success).toBe(false)
    expect(result.message).toContain('Backend non connecté')
  })
})

// ── getUploadStatus ─────────────────────────────────────────────────────────

describe('getUploadStatus', () => {
  it('retourne le statut du job', async () => {
    mockFetch({ status: 'done', datasets: ['energie'] })
    const result = await getUploadStatus('abc-123')
    expect(result.status).toBe('done')
    expect(result.datasets).toContain('energie')
  })

  it('retourne null si erreur réseau', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('fail'))
    expect(await getUploadStatus('xyz')).toBeNull()
  })
})

// ── getDataset ──────────────────────────────────────────────────────────────

describe('getDataset', () => {
  it('retourne les données si le backend répond', async () => {
    const mockData = [{ id: 1, energie: 'Eau', kgCO2e: 2.08 }]
    mockFetch(mockData)
    const result = await getDataset('energie')
    expect(result).toEqual(mockData)
    expect(fetch).toHaveBeenCalledWith('/api/data/energie', expect.any(Object))
  })

  it('retourne null si le backend retourne 404', async () => {
    mockFetch({ detail: 'Not found' }, false, 404)
    expect(await getDataset('energie')).toBeNull()
  })

  it('retourne null si erreur réseau', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('fail'))
    expect(await getDataset('energie')).toBeNull()
  })
})
