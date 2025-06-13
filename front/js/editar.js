// Espera que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', async () => {

  // Obtiene el parámetro "id" de la URL para identificar el producto a editar
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')

  // Realiza una solicitud GET para obtener los datos del producto por su ID
  const res = await fetch(`/api/v1/productos/${id}`)
  const prod = await res.json()

  // Carga los datos del producto en los campos del formulario
  document.getElementById('nombre').value = prod.nombre
  document.getElementById('marca').value = prod.marca
  document.getElementById('precio').value = prod.precio
  document.getElementById('stock').value = prod.stock

  // Maneja el envío del formulario para editar el producto
  document.getElementById('form-editar').addEventListener('submit', async e => {
    e.preventDefault() // Evita que el formulario recargue la página

    // Crea un objeto con los datos actualizados desde el formulario
    const actualizado = {
      nombre: document.getElementById('nombre').value,
      marca: document.getElementById('marca').value,
      precio: parseFloat(document.getElementById('precio').value),
      stock: parseInt(document.getElementById('stock').value)
    }

    // Realiza una solicitud PUT para actualizar el producto en el backend
    const res = await fetch(`/api/v1/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actualizado)
    })

    // Muestra un mensaje al usuario según el resultado de la operación
    const data = await res.json()
    document.getElementById('mensajes').textContent = res.ok ? 'Producto actualizado' : data.mensaje
  })

  // Maneja el evento de clic para eliminar el producto actual
  document.getElementById('eliminar-registro').addEventListener('click', async () => {
    // Confirma con el usuario si desea eliminar el producto
    if (confirm('¿Estás seguro que deseas eliminar este producto?')) {
      // Realiza una solicitud DELETE para eliminar el producto
      const res = await fetch(`/api/v1/productos/${id}`, {
        method: 'DELETE'
      })

      // Si la eliminación fue exitosa, redirige al listado; si no, muestra un error
      if (res.ok) {
        window.location.href = 'index.html'
      } else {
        const data = await res.json()
        document.getElementById('mensajes').textContent = data.mensaje
      }
    }
  })
})