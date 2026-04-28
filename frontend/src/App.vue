<!--frontend\src\App.vue-->
<script setup>
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="app-container">
    <router-view />

    <Footer />
  </div>
</template>

<style>
/* Estilos globales si los necesitas */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Esto asegura que el footer se quede abajo si la página tiene poco contenido */
footer {
  margin-top: auto;
}
</style>