<!--frontend\src\views\ProductDetailView.vue-->
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabaseClient'

const route = useRoute()
const producto = ref(null)
const fotoActiva = ref(0)
const cargando = ref(true)

// Configuración de la Lupa
const zoomState = reactive({
  show: false,
  backgroundPosition: '0% 0%',
  left: 0,
  top: 0
})

const WHATSAPP_NUMBER = "52XXXXXXXXXX" 

const obtenerDetalle = async () => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', route.params.id)
      .single()
    
    if (error) throw error
    producto.value = data
  } catch (err) {
    console.error("Error:", err.message)
  } finally {
    cargando.value = false
  }
}

// Lógica de la Lupa (Estilo Mercado Libre)
const handleMouseMove = (e) => {
  const container = e.currentTarget
  const { left, top, width, height } = container.getBoundingClientRect()
  
  // Calcular posición del mouse relativa al contenedor
  const x = e.pageX - left - window.scrollX
  const y = e.pageY - top - window.scrollY
  
  // Calcular porcentaje para el background-position
  const percentX = (x / width) * 100
  const percentY = (y / height) * 100
  
  zoomState.backgroundPosition = `${percentX}% ${percentY}%`
  zoomState.left = x - 75 // Centrar lupa (mitad de su ancho)
  zoomState.top = y - 75  // Centrar lupa (mitad de su alto)
  zoomState.show = true
}

const contactarWhatsApp = () => {
  const mensaje = `¡Hola! Me interesa la muñeca "${producto.value.nombre}". Vi que tienen ${producto.value.cantidad} disponibles. ¿Me puede apartar una? ✨`
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
  window.open(url, '_blank')
}

onMounted(obtenerDetalle)
</script>

<template>
  <div v-if="!cargando && producto" class="min-h-screen bg-[#fffcf9] pb-20 font-serif">
    
    <nav class="bg-white/80 backdrop-blur-md border-b border-rose-50 px-6 py-4 mb-8 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto">
        <router-link to="/" class="text-rose-400 font-bold italic flex items-center gap-2 hover:text-rose-500 transition-colors">
          <span class="text-2xl">←</span> Volver al catálogo
        </router-link>
      </div>
    </nav>
    
    <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
      
      <div class="space-y-6">
        <div 
          class="relative aspect-square rounded-[3rem] bg-white border border-rose-50 shadow-sm overflow-hidden cursor-none"
          @mousemove="handleMouseMove"
          @mouseleave="zoomState.show = false"
        >
          <img 
            :src="producto.imagenes_url[fotoActiva]" 
            class="w-full h-full object-cover"
          />

          <div 
            v-show="zoomState.show"
            class="lupa-lens"
            :style="{
              left: zoomState.left + 'px',
              top: zoomState.top + 'px',
              backgroundImage: `url(${producto.imagenes_url[fotoActiva]})`,
              backgroundPosition: zoomState.backgroundPosition
            }"
          ></div>

          <div v-if="producto.etiqueta" class="absolute top-6 left-6 pointer-events-none">
            <span class="bg-rose-400 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
              {{ producto.etiqueta }}
            </span>
          </div>
        </div>
        
        <div v-if="producto.imagenes_url.length > 1" class="flex gap-4 overflow-x-auto py-2 px-1">
          <button 
            v-for="(img, i) in producto.imagenes_url" :key="i"
            @click="fotoActiva = i"
            class="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300"
            :class="fotoActiva === i ? 'border-rose-400 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'"
          >
            <img :src="img" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <div class="flex flex-col justify-center">
        <div class="mb-8">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-800 italic mb-4 leading-tight">
            {{ producto.nombre }}
          </h1>
          
          <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="text-4xl font-black text-rose-500 tracking-tighter">${{ producto.precio }}</span>
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full" :class="producto.cantidad > 0 ? 'bg-emerald-400' : 'bg-red-400'"></span>
              <span class="text-gray-400 text-sm font-bold uppercase tracking-wider">
                {{ producto.cantidad > 0 ? `${producto.cantidad} disponibles` : 'Agotado' }}
              </span>
            </div>
          </div>
          
          <div class="h-[1px] w-20 bg-rose-200 mb-8"></div>
          
          <p class="text-gray-500 text-lg leading-relaxed italic mb-10">
            {{ producto.descripcion || 'Esta pieza ha sido elaborada meticulosamente a mano por artesanos de Tlaxcala.' }}
          </p>
        </div>

        <button 
          @click="contactarWhatsApp"
          :disabled="producto.cantidad <= 0"
          class="w-full p-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          :class="producto.cantidad > 0 ? 'bg-rose-400 text-white shadow-rose-100 hover:bg-rose-500' : 'bg-gray-200 text-gray-400'"
        >
          <span>{{ producto.cantidad > 0 ? 'Apartar por WhatsApp' : 'Producto Agotado' }}</span>
          <span v-if="producto.cantidad > 0" class="text-2xl">💬</span>
        </button>
        
        <p class="text-center text-gray-400 text-[10px] uppercase font-bold mt-6 tracking-widest">
          Piezas únicas hechas con amor en Tlaxcala
        </p>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen bg-[#fffcf9] flex items-center justify-center">
    <div class="animate-pulse text-rose-400 italic font-bold">Buscando tesoros... ✨</div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

.font-serif {
  font-family: 'Playfair Display', serif;
}

/* Lente de Lupa */
.lupa-lens {
  position: absolute;
  width: 150px;
  height: 150px;
  border: 3px solid white;
  border-radius: 50%;
  pointer-events: none; /* Importante para no bloquear el mousemove */
  box-shadow: 0 0 15px rgba(0,0,0,0.2), inset 0 0 10px rgba(0,0,0,0.1);
  background-repeat: no-repeat;
  background-size: 600%; /* Este número define qué tan potente es el zoom */
  z-index: 10;
}

/* Scrollbar para miniaturas */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #fb7185;
  border-radius: 10px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: #fff1f2;
}
</style>