<!--frontend\src\views\HomeView.vue-->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router' // Para navegar
import { supabase } from '../lib/supabaseClient'
import nicteLogo from '../assets/nicte_logo.png'

const router = useRouter()
const productos = ref([])
const cargando = ref(true)

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER // "52XXXXXXXXXX" // Número de WhatsApp (con código de país)

const obtenerProductos = async () => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    productos.value = data
  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    cargando.value = false
  }
}

// Función para ir al detalle
const verDetalle = (id) => {
  router.push(`/producto/${id}`)
}

const contactarWhatsApp = (nombreProducto) => {
  const mensaje = `¡Hola! Me interesa la "${nombreProducto}" que vi en su página. ¿Me podrían dar más información?`
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
  window.open(url, '_blank')
}

const agendarPedidoEspecial = () => {
  const mensaje = `¡Hola! Me gustaría agendar un pedido personalizado de una muñeca. ¿Podrían darme informes sobre el proceso? ✨`
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
  window.open(url, '_blank')
}

onMounted(() => { obtenerProductos() })
</script>

<template>
  <div class="min-h-screen bg-[#fffcf9] pb-20 font-serif-main">
    
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-50 px-6 py-3 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <img :src="nicteLogo" alt="Mini Logo" class="h-8 w-8 object-contain" />
        <span class="font-serif text-rose-500 font-bold">Muñecas Nicté</span>
      </div>
      <div class="flex gap-6 text-sm font-medium text-gray-500">
        <router-link to="/" class="hover:text-rose-400 transition-colors border-b-2 border-rose-400">Catálogo</router-link>
        <router-link to="/admin" class="hover:text-rose-400 transition-colors">Panel Control</router-link>
      </div>
    </nav>

    <header class="relative pt-10 pb-16 px-4 text-center overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-rose-50 to-[#fffcf9] z-0"></div>
      <div class="relative z-10 flex flex-col items-center">
        <div class="mb-4 relative group">
          <div class="absolute inset-0 bg-rose-200 rounded-full blur-2xl opacity-20"></div>
          <div class="relative p-1 rounded-full border border-rose-100 shadow-sm bg-white">
            <img :src="nicteLogo" alt="Logo" class="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover" />
          </div>
        </div>
        <h1 class="text-4xl md:text-5xl font-serif text-rose-500 font-bold mb-2 italic tracking-tight">Muñecas Nicté</h1>
        <div class="flex justify-center items-center gap-3">
          <div class="h-[1px] w-10 bg-rose-200"></div>
          <p class="text-lg md:text-xl text-rose-400 font-medium italic font-serif px-1">Tu dulce compañía</p>
          <div class="h-[1px] w-10 bg-rose-200"></div>
        </div>
      </div>
      <div class="absolute -bottom-1 left-0 w-full leading-[0]">
        <svg viewBox="0 0 1440 80" class="fill-[#fffcf9] w-full h-auto">
          <path d="M0,48L80,42.7C160,37,320,27,480,32C640,37,800,59,960,64C1120,69,1280,59,1360,53.3L1440,48L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"></path>
        </svg>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 -mt-4 relative z-20">
      <div v-if="cargando" class="text-center py-20">
        <div class="animate-bounce inline-block p-3 bg-rose-50 rounded-full border border-rose-100">
          <div class="h-3 w-3 bg-rose-400 rounded-full"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div 
          v-for="item in productos" :key="item.id" 
          @click="verDetalle(item.id)"
          class="bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border border-rose-50 overflow-hidden group flex flex-col cursor-pointer"
        >
          <div class="relative h-72 overflow-hidden bg-rose-50">
            <div v-if="item.etiqueta" class="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-rose-500 text-[10px] uppercase tracking-widest font-black px-4 py-1 rounded-full shadow-sm">
              {{ item.etiqueta }}
            </div>
            <img 
              :src="item.imagenes_url[0]" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>

          <div class="p-8 flex flex-col flex-grow text-center">
            <h3 class="text-xl font-serif font-bold text-gray-800 mb-2 tracking-tight">{{ item.nombre }}</h3>
            <p class="text-gray-400 text-xs line-clamp-2 mb-6 italic leading-relaxed">{{ item.descripcion }}</p>
            
            <div class="mt-auto pt-4 border-t border-rose-50 flex items-center justify-between">
              <div class="text-left">
                <span class="block text-[9px] text-rose-300 font-bold uppercase tracking-widest">Precio</span>
                <span class="text-xl font-black text-rose-500 tracking-tighter">${{ item.precio }}</span>
              </div>
              <button 
                @click.stop="contactarWhatsApp(item.nombre)"
                class="bg-rose-400 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-rose-500 active:scale-95 transition-all shadow-md"
              >
                Consultar
              </button>
            </div>
          </div>
        </div>
      </div>
      </main>
  </div>
</template>