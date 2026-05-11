import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const VERDE  = [22, 163, 74];
const GRIS   = [31, 41, 55];
const GRIS2  = [107, 114, 128];
const BLANCO = [255, 255, 255];
const FONDO  = [249, 250, 251];
const BORDE  = [229, 231, 235];

export const generarFacturaPDF = (pedido, usuario) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
  const ancho = doc.internal.pageSize.getWidth();
  const alto  = doc.internal.pageSize.getHeight();
  let y = 0;

  // ── Encabezado verde ───────────────────────────────────────
  doc.setFillColor(...VERDE);
  doc.rect(0, 0, ancho, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...BLANCO);
  doc.text('MaxiDespensa', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Tu supermercado de confianza', 14, 18);
  doc.text('Guatemala  |  maxidespensa.com', 14, 23);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('FACTURA', ancho - 14, 12, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`N deg ${pedido.numeroPedido}`, ancho - 14, 18, { align: 'right' });

  const fechaEmision = new Date(pedido.createdAt || new Date()).toLocaleDateString('es-GT', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
  doc.text(`Fecha: ${fechaEmision}`, ancho - 14, 23, { align: 'right' });

  y = 36;

  // ── Datos cliente y entrega ────────────────────────────────
  const mitad = (ancho - 28) / 2;

  doc.setFillColor(...FONDO);
  doc.setDrawColor(...BORDE);
  doc.roundedRect(14, y, mitad - 4, 40, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...VERDE);
  doc.text('DATOS DEL CLIENTE', 18, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRIS);
  doc.setFontSize(9);
  doc.text(usuario?.nombre || pedido.datosEnvio?.nombre || 'Cliente', 18, y + 14);
  doc.setTextColor(...GRIS2);
  doc.setFontSize(8);
  doc.text(usuario?.email || '', 18, y + 20);
  doc.text(`Tel: ${pedido.datosEnvio?.telefono || '---'}`, 18, y + 26);

  doc.setFillColor(...FONDO);
  doc.roundedRect(14 + mitad + 4, y, mitad - 4, 40, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...VERDE);
  doc.text('DIRECCION DE ENTREGA', 14 + mitad + 8, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRIS);
  doc.setFontSize(8);
  const dir = pedido.datosEnvio;
  if (dir) {
    doc.text(dir.nombre || '', 14 + mitad + 8, y + 14);
    const lineas = doc.splitTextToSize(dir.direccion || '', mitad - 14);
    doc.text(lineas, 14 + mitad + 8, y + 20);
    doc.text(`${dir.ciudad || ''}, ${dir.departamento || ''}`, 14 + mitad + 8, y + 30);
    if (dir.referencias) {
      doc.setTextColor(...GRIS2);
      doc.setFontSize(7.5);
      const ref = doc.splitTextToSize(`Ref: ${dir.referencias}`, mitad - 14);
      doc.text(ref, 14 + mitad + 8, y + 36);
    }
  }

  y += 48;

  // ── Tabla de productos ─────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...GRIS);
  doc.text('Detalle de productos', 14, y);
  y += 4;

  const items = pedido.items || [];

  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [['#', 'Producto', 'Precio unit.', 'Cant.', 'Subtotal']],
    body: items.map((item, i) => [
      i + 1,
      item.nombre || item.NombreProducto || '',
      `Q${parseFloat(item.precio || item.PrecioUnitario || 0).toFixed(2)}`,
      item.cantidad || item.Cantidad || 1,
      `Q${(parseFloat(item.precio || item.PrecioUnitario || 0) * (item.cantidad || item.Cantidad || 1)).toFixed(2)}`,
    ]),
    headStyles: { fillColor: GRIS, textColor: BLANCO, fontStyle: 'bold', fontSize: 8.5, halign: 'center' },
    bodyStyles: { fontSize: 8.5, textColor: GRIS },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'left' },
      2: { halign: 'right', cellWidth: 28 },
      3: { halign: 'center', cellWidth: 16 },
      4: { halign: 'right', cellWidth: 28 },
    },
    alternateRowStyles: { fillColor: FONDO },
    tableLineColor: BORDE,
    tableLineWidth: 0.3,
  });

  y = doc.lastAutoTable.finalY + 6;

  // ── Totales ────────────────────────────────────────────────
  const total = parseFloat(pedido.total || 0);
  const anchoTotales = 80;
  const xTotales = ancho - 14 - anchoTotales;

  doc.setFillColor(...FONDO);
  doc.setDrawColor(...BORDE);
  doc.roundedRect(xTotales, y, anchoTotales, 30, 3, 3, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...GRIS2);
  doc.text('Subtotal:', xTotales + 4, y + 9);
  doc.text('Envio:', xTotales + 4, y + 16);

  doc.setTextColor(...GRIS);
  doc.text(`Q${total.toFixed(2)}`, xTotales + anchoTotales - 4, y + 9, { align: 'right' });
  doc.setTextColor(...VERDE);
  doc.text('GRATIS', xTotales + anchoTotales - 4, y + 16, { align: 'right' });

  doc.setDrawColor(...BORDE);
  doc.line(xTotales + 4, y + 20, xTotales + anchoTotales - 4, y + 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...GRIS);
  doc.text('TOTAL:', xTotales + 4, y + 28);
  doc.setTextColor(...VERDE);
  doc.setFontSize(13);
  doc.text(`Q${total.toFixed(2)}`, xTotales + anchoTotales - 4, y + 28, { align: 'right' });

  y += 38;

  // ── Metodo de pago y estado ────────────────────────────────
  const METODOS = { efectivo: 'Efectivo al recibir', tarjeta: 'Tarjeta de credito/debito', transferencia: 'Transferencia bancaria' };
  const ESTADOS = { pendiente: 'Pendiente', confirmado: 'Confirmado', enviado: 'En camino', entregado: 'Entregado', cancelado: 'Cancelado' };

  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(...VERDE);
  doc.roundedRect(14, y, ancho - 28, 18, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...VERDE);
  doc.text('METODO DE PAGO', 20, y + 7);
  doc.text('ESTADO DEL PEDIDO', ancho / 2, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRIS);
  doc.setFontSize(9);
  doc.text(METODOS[pedido.metodoPago] || pedido.metodoPago || '---', 20, y + 14);
  doc.text(ESTADOS[pedido.estado] || pedido.estado || '---', ancho / 2, y + 14);

  y += 26;

  // ── Notas ──────────────────────────────────────────────────
  if (pedido.notas) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...GRIS2);
    doc.text('Notas:', 14, y);
    doc.setFont('helvetica', 'normal');
    const notasLineas = doc.splitTextToSize(pedido.notas, ancho - 28);
    doc.text(notasLineas, 14, y + 5);
    y += 5 + notasLineas.length * 4 + 6;
  }

  // ── Pie de pagina ──────────────────────────────────────────
  const yFooter = alto - 20;

  doc.setFillColor(...VERDE);
  doc.rect(0, yFooter - 2, ancho, 0.5, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...GRIS2);
  doc.text('Gracias por su compra en MaxiDespensa', ancho / 2, yFooter + 4, { align: 'center' });
  doc.text('Conserve este documento como comprobante de su compra.', ancho / 2, yFooter + 9, { align: 'center' });

  doc.setTextColor(...VERDE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('maxidespensa.com', ancho / 2, yFooter + 14, { align: 'center' });

  doc.save(`Factura-${pedido.numeroPedido}.pdf`);
};
