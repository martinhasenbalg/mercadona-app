import jsPDF from 'jspdf'

function formatEurSimple(value) {
  const num = parseFloat(value || 0)
  return num.toFixed(2).replace('.', ',') + ' €'
}

export function buildWhatsAppText(items) {
  const lines = items.map((item) => {
    const price = formatEurSimple(parseFloat(item.unit_price || 0) * item.quantity)
    return `• ${item.display_name} x${item.quantity} — ${price}`
  })

  const total = items.reduce((sum, item) => {
    return sum + parseFloat(item.unit_price || 0) * item.quantity
  }, 0)

  lines.push('')
  lines.push(`*Total estimado: ${formatEurSimple(total)}*`)
  lines.push('_Lista generada en Mercadona App_')

  return lines.join('\n')
}

export function shareWhatsApp(items) {
  const text = buildWhatsAppText(items)
  const encoded = encodeURIComponent(text)
  window.open(`https://wa.me/?text=${encoded}`, '_blank')
}

export function copyToClipboard(items) {
  const text = buildWhatsAppText(items)
  return navigator.clipboard.writeText(text)
}

export function exportPDF(items) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const green = [0, 130, 66]
  const pageWidth = 210

  // Header
  doc.setFillColor(...green)
  doc.rect(0, 0, pageWidth, 28, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Mercadona — Lista de compra', 14, 18)

  // Date
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  const dateStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
  doc.text(dateStr, pageWidth - 14, 18, { align: 'right' })

  // Table header
  let y = 38
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(9)
  doc.text('PRODUCTO', 14, y)
  doc.text('CANT.', 120, y, { align: 'right' })
  doc.text('P. UNIT.', 148, y, { align: 'right' })
  doc.text('TOTAL', 196, y, { align: 'right' })

  doc.setDrawColor(220, 220, 220)
  doc.line(14, y + 2, 196, y + 2)
  y += 9

  // Rows
  doc.setTextColor(30, 30, 30)
  doc.setFontSize(10)
  let grandTotal = 0

  items.forEach((item, i) => {
    if (y > 270) {
      doc.addPage()
      y = 20
    }

    const lineTotal = parseFloat(item.unit_price || 0) * item.quantity
    grandTotal += lineTotal

    if (i % 2 === 0) {
      doc.setFillColor(248, 248, 248)
      doc.rect(12, y - 5, 184, 8, 'F')
    }

    const name = item.display_name.length > 55
      ? item.display_name.substring(0, 52) + '...'
      : item.display_name

    doc.setFont('helvetica', 'normal')
    doc.text(name, 14, y)
    doc.text(String(item.quantity), 120, y, { align: 'right' })
    doc.text(formatEurSimple(item.unit_price), 148, y, { align: 'right' })
    doc.setFont('helvetica', 'bold')
    doc.text(formatEurSimple(lineTotal), 196, y, { align: 'right' })
    doc.setFont('helvetica', 'normal')

    y += 9
  })

  // Total row
  y += 4
  doc.setFillColor(...green)
  doc.rect(12, y - 6, 184, 11, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('TOTAL ESTIMADO', 14, y + 1)
  doc.text(formatEurSimple(grandTotal), 196, y + 1, { align: 'right' })

  doc.save(`lista-mercadona-${Date.now()}.pdf`)
}
