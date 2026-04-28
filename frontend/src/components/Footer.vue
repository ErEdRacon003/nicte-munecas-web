<!--frontend\src\components\Footer.vue-->
<template>
  <footer class="bg-white border-t border-rose-50 pt-16 pb-8 mt-20 font-serif">
    <div class="max-w-6xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center md:text-left">
        
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-rose-400 italic">Muñecas Nicté</h3>
          <p class="text-gray-400 text-sm leading-relaxed italic">
            Preservando la tradición y el colorido de Tlaxcala a través de piezas únicas hechas a mano con amor.
          </p>
        </div>

        <div class="space-y-4">
          <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-800">Navegación</h4>
          <nav class="flex flex-col gap-2">
            <router-link to="/" class="text-gray-400 hover:text-rose-400 transition-colors text-sm">Catálogo</router-link>
            <router-link to="/admin" class="text-gray-400 hover:text-rose-400 transition-colors text-sm">Administración</router-link>
          </nav>
        </div>

        <div class="space-y-4">
          <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-800">Ubicación</h4>
          <p class="text-gray-400 text-sm italic">
            Tlaxcala, México 🇲🇽<br>
            Envíos a toda la República
          </p>
        </div>
      </div>

      <div class="pt-8 border-t border-rose-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
          © 2026 Muñecas Nicté - Todos los derechos reservados
        </p>
        <div class="flex gap-4">
          <span class="text-rose-200 text-xs italic">Hecho con el ❤️ en Tlaxcala</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>