// Espera a que el DOM esté completamente cargado para ejecutar el código
document.addEventListener('DOMContentLoaded', async () => {
  // Obtiene la referencia al contenedor de la tabla donde se mostrarán los productos
  const tabla = document.getElementById('contenedor-productos')

  // Realiza una solicitud GET a la API para obtener todos los productos
  const res = await fetch('/api/v1/productos')
  const productos = await res.json()

  // Itera sobre cada producto recibido para crear filas en la tabla
  productos.forEach(prod => {
    // Crea un nuevo elemento <tr> para cada producto
    const tr = document.createElement('tr')

    // Rellena la fila con los datos del producto y un enlace para editarlo
    tr.innerHTML = `
      <td>${prod.nombre}</td>
      <td>${prod.marca}</td>
      <td>${prod.precio}</td>
      <td>${prod.stock}</td>
      <td><a href="editar.html?id=${prod.id}">Editar</a></td>
    `

    // Agrega la fila al cuerpo de la tabla
    tabla.appendChild(tr)
  })
})