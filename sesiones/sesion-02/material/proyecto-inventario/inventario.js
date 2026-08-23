export function calcularInventario(productos) {
  let valorTotal = 0;
  const agotados = [];

  for (let i = 0; i < productos.length; i += 1) {
    productos[i].nombre = productos[i].nombre.trim();
    valorTotal += productos[i].precio * productos[i].cantidad;

    if (productos[i].cantidad === 0) {
      agotados.push(productos[i].nombre);
    }
  }

  return {
    totalProductos: productos.length,
    valorTotal,
    agotados
  };
}

export function formatearResumen(resumen) {
  return `Productos: ${resumen.totalProductos} | Valor: ${resumen.valorTotal.toFixed(2)} € | Agotados: ${resumen.agotados.join(", ") || "ninguno"}`;
}
