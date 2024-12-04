let carrito = [];

function agregarAlCarrito(event) {
  event.preventDefault();

  const id = document.getElementById('id').value;
  const nombre = document.getElementById('nombre').value;
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const precioVenta = parseFloat(document.getElementById('precio').value);
  const oferta = document.getElementById('oferta').value === 'Sí';
  const cantidadOferta = parseInt(document.getElementById('cantidadOferta').value) || 1;

  let subtotal = 0;

  if (oferta) {
    const conjuntos = Math.floor(cantidad / cantidadOferta);
    subtotal = conjuntos * precioVenta;
  } else {
    subtotal = cantidad * precioVenta;
  }

  carrito.push({ id, nombre, cantidad, subtotal, oferta });
  actualizarCarrito();
  event.target.reset();
}

function actualizarCarrito() {
  const tbody = document.getElementById('items-carrito');
  const totalElement = document.getElementById('total');

  tbody.innerHTML = '';
  let total = 0;

  carrito.forEach((item, index) => {
    total += item.subtotal;

    const row = `
      <tr>
        <td>${item.id}</td>
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
        <td>${item.oferta ? 'Sí' : 'No'}</td>
        <td>${item.subtotal}</td>
        <td><button onclick="eliminarDelCarrito(${index})">Eliminar</button></td>
      </tr>
    `;
    tbody.innerHTML += row;
  });

  totalElement.textContent = total;
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

function confirmarMovimiento() {
  const tipo = document.getElementById('tipo-movimiento').value;
  const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);

  const movimiento = { tipo, items: carrito, total };

  fetch('https://script.google.com/macros/s/AKfycbx5LLLr43DKZocTECwmNvfdtR5g1ryB6MFERlpzthyginTGRqdOLL0CeeKWeKs5V2YKVA/exec', {
    method: 'POST',
    body: JSON.stringify(movimiento),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .then(data => {
      console.log('Movimiento registrado:', data);
      carrito = [];
      actualizarCarrito();
    })
    .catch(error => console.error('Error:', error));
}

function toggleCarrito() {
  const carrito = document.getElementById('carrito');
  carrito.classList.toggle('hidden');
}
