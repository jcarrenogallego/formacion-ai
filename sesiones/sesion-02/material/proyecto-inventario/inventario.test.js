import test from "node:test";
import assert from "node:assert/strict";
import { calcularInventario, formatearResumen } from "./inventario.js";

test("calcula el resumen del inventario", () => {
  const productos = [
    { nombre: " Teclado ", precio: 40, cantidad: 2 },
    { nombre: "Ratón", precio: 20, cantidad: 0 },
    { nombre: "Monitor", precio: 150, cantidad: 1 }
  ];

  assert.deepEqual(calcularInventario(productos), {
    totalProductos: 3,
    valorTotal: 230,
    agotados: ["Ratón"]
  });
});

test("formatea el resumen", () => {
  const resumen = { totalProductos: 1, valorTotal: 10, agotados: [] };

  assert.equal(
    formatearResumen(resumen),
    "Productos: 1 | Valor: 10.00 € | Agotados: ninguno"
  );
});

test("funciona con un inventario vacío", () => {
  assert.deepEqual(calcularInventario([]), {
    totalProductos: 0,
    valorTotal: 0,
    agotados: []
  });
});
