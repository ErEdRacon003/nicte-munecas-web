<!--frontend\src\views\DevControlView.vue-->
<script setup>
import { ref } from 'vue'
import nicteLogo from '../assets/nicte_logo.png'

const form = ref({ email: '', password: '', nombre: '', secretKey: '' })
const mensaje = ref({ texto: '', tipo: '' })
const cargando = ref(false)

const crearAcceso = async () => {
  cargando.value = true
  mensaje.value = { texto: '', tipo: '' }
  try {
    const res = await fetch('http://localhost:3000/api/crear-familiar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.value.email,
        password: form.value.password,
        nombre: form.value.nombre,
        secret_key: form.value.secretKey
      })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'No autorizado')
    mensaje.value = { texto: '¡Cuenta creada con éxito! ✨', tipo: 'exito' }
    form.value = { email: '', password: '', nombre: '', secretKey: '' }
  } catch (err) {
    mensaje.value = { texto: err.message, tipo: 'error' }
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-white">
    <div class="max-w-md w-full bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
      <h1 class="text-xl font-bold mb-6 text-center italic text-blue-400">Nicté Dev Console</h1>
      <div class="space-y-4">
        <input v-model="form.nombre" type="text" placeholder="Nombre (Ej: Mamá)" class="w-full bg-slate-950 p-4 rounded-xl border border-slate-700 outline-none focus:border-blue-500" />
        <input v-model="form.email" type="email" placeholder="Correo" class="w-full bg-slate-950 p-4 rounded-xl border border-slate-700 outline-none focus:border-blue-500" />
        <input v-model="form.password" type="password" placeholder="Contraseña" class="w-full bg-slate-950 p-4 rounded-xl border border-slate-700 outline-none focus:border-blue-500" />
        <div class="pt-4 border-t border-slate-700">
          <input v-model="form.secretKey" type="password" placeholder="Master Dev Key" class="w-full bg-slate-950 p-4 rounded-xl border border-amber-900 text-amber-200 outline-none" />
        </div>
        <button @click="crearAcceso" :disabled="cargando" class="w-full bg-blue-600 p-4 rounded-xl font-bold hover:bg-blue-500 transition-all">
          {{ cargando ? 'Creando...' : 'Generar Acceso Familiar' }}
        </button>
        <p v-if="mensaje.texto" :class="mensaje.tipo === 'error' ? 'text-red-400' : 'text-emerald-400'" class="text-center italic mt-2">
          {{ mensaje.texto }}
        </p>
      </div>
    </div>
  </div>
</template>