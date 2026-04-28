<!--frontend\src\views\AdminView.vue-->
<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'vue-router'

const router = useRouter()

// --- ESTADOS ---
const email = ref('')
const password = ref('')
const sesionIniciada = ref(false)
const errorLogin = ref('')
const subiendo = ref(false)

const productos = ref([])
const nuevaMuneca = ref({ 
  nombre: '', 
  precio: '', 
  descripcion: '', 
  imagenes_url: [],
  etiqueta: '',
  cantidad: 0 
}) 

const archivosSeleccionados = ref([]) 
const previsualizaciones = ref([]) 
const editandoId = ref(null)

// --- AUTENTICACIÓN ---
const verificarSesion = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    sesionIniciada.value = true
    obtenerProductos()
  }
}

const login = async () => {
  errorLogin.value = ''
  const { error } = await supabase.auth.signInWithPassword({ 
    email: email.value, 
    password: password.value 
  })
  if (error) {
    errorLogin.value = 'Credenciales no válidas 🌸'
  } else { 
    sesionIniciada.value = true
    obtenerProductos() 
  }
}

const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (!error) {
    sesionIniciada.value = false
    router.push('/') // Opcional: mandarlos a la tienda al salir
  }
}

const obtenerProductos = async () => {
  const { data } = await supabase
    .from('productos')
    .select('*')
    .order('created_at', { ascending: false })
  productos.value = data || []
}

// --- MANEJO DE IMÁGENES ---
const manejarSeleccion = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    archivosSeleccionados.value.push(file)
    previsualizaciones.value.push(URL.createObjectURL(file))
  })
}

const quitarFotoPrevia = (index) => {
  archivosSeleccionados.value.splice(index, 1)
  previsualizaciones.value.splice(index, 1)
}

const quitarFotoExistente = (index) => {
  nuevaMuneca.value.imagenes_url.splice(index, 1)
}

// --- GUARDADO ---
const guardarProducto = async () => {
  if (!nuevaMuneca.value.nombre) {
    alert("Por favor escribe un nombre ✨")
    return
  }

  subiendo.value = true
  try {
    let listaFinalUrls = editandoId.value ? [...nuevaMuneca.value.imagenes_url] : []

    if (archivosSeleccionados.value.length > 0) {
      const nuevasSubidas = await Promise.all(
        archivosSeleccionados.value.map(async (archivo) => {
          const nombreArchivo = `${Date.now()}_${archivo.name}`
          const { error: uploadError } = await supabase.storage
            .from('fotos-munecas')
            .upload(nombreArchivo, archivo)

          if (uploadError) throw uploadError

          const { data: urlData } = supabase.storage
            .from('fotos-munecas')
            .getPublicUrl(nombreArchivo)
          
          return urlData.publicUrl
        })
      )
      listaFinalUrls = [...listaFinalUrls, ...nuevasSubidas]
    }

    const datosProducto = {
      nombre: nuevaMuneca.value.nombre,
      precio: nuevaMuneca.value.precio,
      descripcion: nuevaMuneca.value.descripcion,
      imagenes_url: listaFinalUrls,
      etiqueta: nuevaMuneca.value.etiqueta,
      cantidad: nuevaMuneca.value.cantidad
    }

    if (editandoId.value) {
      await supabase.from('productos').update(datosProducto).eq('id', editandoId.value)
    } else {
      await supabase.from('productos').insert([datosProducto])
    }

    alert("¡Inventario actualizado con éxito! ✨")
    limpiarFormulario()
    obtenerProductos()
  } catch (err) {
    alert("Error al guardar: " + err.message)
  } finally {
    subiendo.value = false
  }
}

const cargarParaEditar = (item) => {
  nuevaMuneca.value = { ...item }
  editandoId.value = item.id
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const eliminarProducto = async (id) => {
  if (confirm('¿Quieres eliminar esta pieza permanentemente?')) {
    await supabase.from('productos').delete().eq('id', id)
    obtenerProductos()
  }
}

const limpiarFormulario = () => {
  nuevaMuneca.value = { 
    nombre: '', 
    precio: '', 
    descripcion: '', 
    imagenes_url: [], 
    etiqueta: '', 
    cantidad: 0 
  }
  archivosSeleccionados.value = []
  previsualizaciones.value = []
  editandoId.value = null
  if (document.getElementById('fileInput')) document.getElementById('fileInput').value = ""
}

onMounted(verificarSesion)
</script>

<template>
  <div class="min-h-screen bg-[#fffcf9] p-4 md:p-10 font-serif text-gray-800">
    
    <header v-if="sesionIniciada" class="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
      <div class="flex items-center gap-3">
        <div class="bg-rose-100 p-2 rounded-2xl">
          <span class="text-2xl">🎨</span>
        </div>
        <div>
          <h1 class="text-xl font-black text-gray-800 italic leading-none">Panel Nicté</h1>
          <p class="text-[10px] text-rose-300 font-bold uppercase tracking-[0.2em]">Gestión de Artesanías</p>
        </div>
      </div>

      <div class="flex gap-2 bg-white p-1.5 rounded-full shadow-sm border border-rose-50">
        <router-link to="/" class="px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-rose-400 transition-all">
          Ver Tienda
        </router-link>
        <button @click="logout" class="bg-rose-50 text-rose-400 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-400 hover:text-white transition-all cursor-pointer">
          Cerrar Sesión
        </button>
      </div>
    </header>

    <div v-if="!sesionIniciada" class="max-w-md mx-auto bg-white p-10 rounded-[3rem] shadow-xl border border-rose-50 mt-10">
      <div class="text-center mb-8">
        <span class="text-4xl mb-4 block">🔐</span>
        <h2 class="text-3xl text-gray-800 font-bold italic">Acceso Privado</h2>
        <p class="text-gray-400 text-sm italic">Sólo para la familia Nicté</p>
      </div>

      <div class="space-y-4">
        <input v-model="email" type="email" placeholder="Correo electrónico" class="w-full p-4 rounded-2xl border border-rose-50 bg-rose-50/20 outline-none focus:ring-2 ring-rose-100 transition-all" />
        <input v-model="password" @keyup.enter="login" type="password" placeholder="Contraseña" class="w-full p-4 rounded-2xl border border-rose-50 bg-rose-50/20 outline-none focus:ring-2 ring-rose-100 transition-all" />
        
        <p v-if="errorLogin" class="text-center text-red-400 text-xs font-bold">{{ errorLogin }}</p>
        
        <button @click="login" class="w-full bg-rose-400 text-white p-5 rounded-2xl font-black shadow-lg shadow-rose-100 uppercase tracking-widest cursor-pointer hover:bg-rose-500 active:scale-95 transition-all">
          Ingresar al Panel
        </button>
      </div>
    </div>

    <div v-else class="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <div class="lg:col-span-7">
        <div class="bg-white p-8 rounded-[3rem] shadow-sm border border-rose-50 sticky top-24">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-gray-600 italic">
              {{ editandoId ? '✨ Editando pieza' : '✍️ Registrar nueva' }}
            </h3>
            <button v-if="editandoId" @click="limpiarFormulario" class="text-[10px] font-bold text-rose-300 uppercase hover:text-rose-500">Cancelar</button>
          </div>
          
          <div class="space-y-4">
            <input v-model="nuevaMuneca.nombre" type="text" placeholder="Nombre de la muñeca" class="w-full p-4 rounded-2xl bg-rose-50/20 border border-rose-50 outline-none focus:border-rose-200 transition-all" />
            
            <div class="grid grid-cols-3 gap-3">
              <div class="col-span-1">
                <label class="text-[9px] text-rose-300 font-bold uppercase ml-2 mb-1 block">Precio</label>
                <input v-model="nuevaMuneca.precio" type="number" placeholder="$" class="w-full p-4 rounded-2xl bg-rose-50/20 border border-rose-50 outline-none font-bold text-rose-500" />
              </div>
              <div class="col-span-1">
                <label class="text-[9px] text-rose-300 font-bold uppercase ml-2 mb-1 block">Stock</label>
                <input v-model="nuevaMuneca.cantidad" type="number" placeholder="0" class="w-full p-4 rounded-2xl bg-rose-50/20 border border-rose-50 outline-none" />
              </div>
              <div class="col-span-1">
                <label class="text-[9px] text-rose-300 font-bold uppercase ml-2 mb-1 block">Etiqueta</label>
                <input v-model="nuevaMuneca.etiqueta" type="text" placeholder="Nueva" class="w-full p-4 rounded-2xl bg-rose-50/20 border border-rose-50 outline-none italic" />
              </div>
            </div>

            <textarea v-model="nuevaMuneca.descripcion" placeholder="¿Qué hace especial a esta pieza?" class="w-full p-4 rounded-2xl bg-rose-50/20 border border-rose-50 outline-none h-28 resize-none"></textarea>
            
            <div class="p-6 border-2 border-dashed border-rose-100 rounded-[2rem] bg-rose-50/5">
              <label class="cursor-pointer block text-center">
                <span class="text-[10px] text-rose-300 font-bold uppercase block mb-3">Galería de Imágenes</span>
                <input id="fileInput" type="file" @change="manejarSeleccion" accept="image/*" multiple class="hidden" />
                <div class="bg-white border border-rose-100 text-rose-400 inline-block px-6 py-2 rounded-full text-[10px] font-black uppercase cursor-pointer shadow-sm hover:bg-rose-50 transition-all">
                  + Agregar Fotos
                </div>
              </label>

              <div v-if="previsualizaciones.length > 0 || nuevaMuneca.imagenes_url.length > 0" class="flex flex-wrap gap-3 mt-6 justify-center">
                <div v-for="(url, index) in nuevaMuneca.imagenes_url" :key="'old-'+index" class="relative group">
                  <img :src="url" class="w-14 h-14 rounded-xl object-cover border-2 border-rose-100" />
                  <button @click="quitarFotoExistente(index)" class="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
                <div v-for="(url, index) in previsualizaciones" :key="'new-'+index" class="relative group">
                  <img :src="url" class="w-14 h-14 rounded-xl object-cover border-2 border-emerald-200" />
                  <button @click="quitarFotoPrevia(index)" class="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs shadow-md">×</button>
                </div>
              </div>
            </div>

            <button @click="guardarProducto" :disabled="subiendo" class="w-full bg-rose-400 text-white p-5 rounded-2xl font-black shadow-lg hover:bg-rose-500 transition-all cursor-pointer uppercase tracking-widest active:scale-95 disabled:opacity-50">
              {{ subiendo ? 'Guardando... ✨' : (editandoId ? 'Actualizar Muñeca' : 'Publicar en Catálogo') }}
            </button>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5 space-y-4">
        <h3 class="text-sm font-black text-rose-300 uppercase tracking-widest ml-4">Tu Inventario ({{ productos.length }})</h3>
        
        <div v-for="item in productos" :key="item.id" 
          class="bg-white p-4 rounded-3xl flex items-center justify-between border border-rose-50 shadow-sm transition-all overflow-hidden"
          :class="editandoId === item.id ? 'ring-2 ring-rose-200' : ''"
        >
          <div class="flex items-center gap-4 truncate">
            <div class="relative flex-shrink-0">
              <img :src="item.imagenes_url && item.imagenes_url[0]" class="w-16 h-16 rounded-2xl object-cover bg-rose-50" />
              <span v-if="item.cantidad <= 0" class="absolute inset-0 bg-white/60 flex items-center justify-center text-[8px] font-black uppercase text-red-500 text-center leading-tight p-1">Sin Stock</span>
            </div>
            <div class="truncate">
              <p class="font-bold text-gray-700 truncate text-sm">{{ item.nombre }}</p>
              <div class="flex gap-2 items-center">
                <span class="text-rose-400 font-black text-xs">${{ item.precio }}</span>
                <span class="text-[9px] font-bold text-gray-300 uppercase italic">Stock: {{ item.cantidad }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex gap-1">
            <button @click="cargarParaEditar(item)" class="p-2.5 text-gray-300 hover:text-rose-400 hover:bg-rose-50 rounded-xl transition-all cursor-pointer">
              <span class="text-sm">✏️</span>
            </button>
            <button @click="eliminarProducto(item.id)" class="p-2.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all cursor-pointer">
              <span class="text-sm">🗑️</span>
            </button>
          </div>
        </div>

        <div v-if="productos.length === 0" class="text-center py-20 border-2 border-dashed border-rose-50 rounded-[3rem]">
          <p class="text-rose-200 italic">No hay productos aún... <br> ¡Empieza a crear! ✨</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

.font-serif {
  font-family: 'Playfair Display', serif;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

/* Animación suave para la entrada de elementos */
.lg\:col-span-5 > div {
  animation: slideIn 0.4s ease-out forwards;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(10px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>