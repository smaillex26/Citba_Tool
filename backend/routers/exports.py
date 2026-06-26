from io import BytesIO

import pandas as pd
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas

from services.database import get_latest_import_payload, record_export

router = APIRouter(tags=["Exports"])


@router.get("/exports/excel")
def export_excel():
    """Exporte le dernier import sous forme de classeur Excel multi-onglets."""
    payload = get_latest_import_payload()
    if payload is None:
        raise HTTPException(status_code=404, detail="Aucun import disponible pour générer un export.")

    output = BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        for dataset, rows in payload["datasets"].items():
            sheet_name = dataset[:31]
            pd.DataFrame(rows).to_excel(writer, sheet_name=sheet_name, index=False)
    output.seek(0)

    filename = f"citba_export_import_{payload['id']}.xlsx"
    record_export(payload["id"], "excel", filename)
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/exports/pdf")
def export_pdf():
    """Exporte un résumé PDF du dernier import."""
    payload = get_latest_import_payload()
    if payload is None:
        raise HTTPException(status_code=404, detail="Aucun import disponible pour générer un export.")

    output = BytesIO()
    pdf = canvas.Canvas(output, pagesize=A4)
    width, height = A4
    y = height - 2 * cm

    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(2 * cm, y, "CITBA - Résumé import carbone")
    y -= 1 * cm

    pdf.setFont("Helvetica", 10)
    pdf.drawString(2 * cm, y, f"Fichier : {payload['filename']}")
    y -= 0.6 * cm
    pdf.drawString(2 * cm, y, f"Import ID : {payload['id']}")
    y -= 0.6 * cm
    pdf.drawString(2 * cm, y, f"Date : {payload['created_at']}")
    y -= 1 * cm

    summary = payload["summary"]
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(2 * cm, y, "Synthèse")
    y -= 0.6 * cm
    pdf.setFont("Helvetica", 10)
    pdf.drawString(2 * cm, y, f"Pages alimentées : {summary.get('dataset_count', 0)}")
    y -= 0.5 * cm
    pdf.drawString(2 * cm, y, f"Lignes importées : {summary.get('total_rows', 0)}")
    y -= 0.9 * cm

    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(2 * cm, y, "Détail par dataset")
    y -= 0.6 * cm
    pdf.setFont("Helvetica", 10)
    for item in summary.get("datasets", []):
        if y < 2 * cm:
            pdf.showPage()
            y = height - 2 * cm
            pdf.setFont("Helvetica", 10)
        pdf.drawString(2 * cm, y, f"- {item.get('label', item.get('key'))} : {item.get('rows', 0)} lignes")
        y -= 0.45 * cm

    pdf.save()
    output.seek(0)

    filename = f"citba_resume_import_{payload['id']}.pdf"
    record_export(payload["id"], "pdf", filename)
    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
