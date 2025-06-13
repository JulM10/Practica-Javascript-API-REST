// Agrega un listener al evento submit del formulario con id 'form-editar'
document.getElementById('form-editar').addEventListener('submit', async e => {
  // Evita que el formulario haga un submit tradicional y recargue la página
  e.preventDefault()

  // Crea un objeto con los datos del nuevo producto recogidos de los campos del formulario
  const nuevoProducto = {
    nombre: document.getElementById('nombre').value,
    marca: document.getElementById('marca').value,
    // Convierte los valores de precio y stock a números
    precio: parseFloat(document.getElementById('precio').value),
    stock: parseInt(document.getElementById('stock').value)
  }

  try {
    // Hace una petición POST a la API para crear un nuevo producto
    const res = await fetch('/api/v1/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // Se envía JSON
      body: JSON.stringify(nuevoProducto) // Convierte el objeto a cadena JSON para enviarlo
    })

    // Se parsea la respuesta JSON del servidor
    const data = await res.json()

    // Muestra un mensaje de éxito o error según la respuesta de la API
    if (res.ok) {
      document.getElementById('mensajes').textContent = 'Producto creado correctamente.'
    } else {
      document.getElementById('mensajes').textContent = data.mensaje
    }
  } catch (error) {
    // En caso de error en la petición, muestra un mensaje genérico
    document.getElementById('mensajes').textContent = 'Error al crear producto.'
  }
})