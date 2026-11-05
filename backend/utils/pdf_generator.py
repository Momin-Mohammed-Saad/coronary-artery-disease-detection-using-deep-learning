from io import BytesIO

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet


def generate_pdf(patient):

    buffer = BytesIO()

    doc = SimpleDocTemplate(buffer)

    styles = getSampleStyleSheet()

    elements = []

    elements.append(Paragraph("CAD AI Diagnostic Report", styles["Title"]))

    elements.append(Spacer(1,12))

    elements.append(Paragraph(f"Name: {patient['name']}", styles["Normal"]))
    elements.append(Paragraph(f"Age: {patient['age']}", styles["Normal"]))
    elements.append(Paragraph(f"Gender: {patient['gender']}", styles["Normal"]))

    elements.append(Spacer(1,12))

    elements.append(Paragraph(
        f"Prediction: {patient['prediction']}",
        styles["Heading2"]
    ))

    elements.append(Paragraph(
        f"Confidence: {patient['confidence']}%",
        styles["Normal"]
    ))

    doc.build(elements)

    buffer.seek(0)

    return buffer