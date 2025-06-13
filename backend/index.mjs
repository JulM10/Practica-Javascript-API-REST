// https://drive.google.com/file/d/1pNsX7QGUtcqq7DM761mBi9BlCGlTBJyb/view
// 

import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const puerto = 3000
const app = express()
const ruta = './backend/data/productos.json'
const rutaURL ='/api/v1/productos'
app.use(express.json())
app.use(express.static(path.join(__dirname, '../front')))

//logica leer el archivo json con productos.
async function leerArchivo() {
    const data = await fs.readFile(ruta, 'utf-8')
    return JSON.parse(data)
}

//Logica guardar el archivo
async function guardarArchivo(data) {
    await fs.writeFile(ruta, JSON.stringify(data, null, 2))
} 
  
// traer todos los productos.
app.get(rutaURL, async (req, res) => {
        const data = await leerArchivo()
        res.json(data.productos)
})

// traer todos los productos con :id
app.get(`${rutaURL}/:id`,async (req, res)=>{
    try{
    const data = await leerArchivo()
    const { id } = req.params
    const prod = data.productos.find(p => p.id == id)
    prod ? res.json(prod) : res.status(404).json({ mensaje: 'Producto no encontrado' })
}catch(error){
    res.status(500).json({mensaje:'Error en el servidor'})
}    
})

// guardar un nuevo producto usando ultimo_id para sumar otro id 
app.post(rutaURL, async (req, res) => {
  try {
    const nuevo = req.body

    // Validación de los datos 
    if (!nuevo.nombre || !nuevo.marca || isNaN(nuevo.precio) || isNaN(nuevo.stock)) {
      return res.status(400).json({ mensaje: 'Datos inválidos. Requiere nombre, marca, precio (número) y stock (número).' })
    }

    const data = await leerArchivo()
    const nuevoId = data.ultimo_id + 1
    nuevo.id = nuevoId
    data.ultimo_id = nuevoId
    data.productos.push(nuevo)
    await guardarArchivo(data)
    res.status(201).json(nuevo)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' })
  }
})

// Modifica un producto existente según su id.
app.put(`${rutaURL}/:id`, async (req, res) => {
  const id = req.params.id
  const cambios = req.body
  const data = await leerArchivo()
  const index = data.productos.findIndex(p => p.id == id)

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' })
  }

  // Validar si alguno de los campos está presente y son correctos
  if (cambios.precio !== undefined && isNaN(cambios.precio)) {
    return res.status(400).json({ mensaje: 'Precio inválido' })
  }
  if (cambios.stock !== undefined && isNaN(cambios.stock)) {
    return res.status(400).json({ mensaje: 'Stock inválido' })
  }

  data.productos[index] = { ...data.productos[index], ...cambios }
  await guardarArchivo(data)
  res.json(data.productos[index])
})

// borrar un archivo 
app.delete(`${rutaURL}/:id`, async (req, res) => {
  const data = await leerArchivo()
  const { id } = req.params
  const index = data.productos.findIndex(p => p.id == id)

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' })
  }

  const eliminado = data.productos.splice(index, 1)
  await guardarArchivo(data)
  res.json(eliminado[0])
})







app.listen(puerto, () => {
   console.log(`Servidor iniciado en http://localhost:${puerto}/`)
  })
