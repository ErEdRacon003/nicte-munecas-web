# 🪆 Muñecas Nicté - Catálogo Artesanal

Sitio web oficial de **Muñecas Nicté**, una marca dedicada a la preservación y difusión de muñecas artesanales de Tlaxcala. Este proyecto permite digitalizar el inventario, gestionar ventas vía WhatsApp y administrar accesos familiares de forma segura.

## 🚀 Tecnologías Utilizadas

### Frontend
* **Vue.js 3 + Vite**: Framework principal para una interfaz reactiva y rápida.
* **Tailwind CSS**: Para un diseño responsivo y artesanal.
* **Vercel**: Hosting y despliegue continuo del cliente.

### Backend & Database
* **Node.js + Express**: Servidor API para lógica de administración (Hosteado en Render).
* **Supabase**: Base de datos relacional (PostgreSQL), autenticación de usuarios y almacenamiento de imágenes (Storage).
* **CORS & Dotenv**: Gestión de seguridad y variables de entorno.

## 🛠️ Funcionalidades Principales

### 1. Panel de Administración (`/admin`)
Interfaz protegida donde los administradores pueden añadir nuevas creaciones, editar precios, actualizar el stock y subir fotografías directamente a la nube.

### 2. Nicté Dev Console
Una consola personalizada para la generación de accesos familiares. Permite crear nuevas cuentas de administrador mediante una **Master Dev Key**, facilitando la colaboración familiar sin exponer el panel de Supabase.

### 3. Catálogo Dinámico
Visualización en tiempo real de los productos disponibles, con etiquetas de disponibilidad y enlace directo para pedidos por WhatsApp.

## 🛡️ Seguridad e Infraestructura
* **RLS (Row Level Security)**: Políticas de seguridad en base de datos para que solo usuarios autenticados realicen cambios.
* **Arquitectura Desacoplada**: El frontend y el backend operan de forma independiente, comunicándose a través de una API REST protegida.
* **Variables de Entorno**: Configuración segura de llaves de acceso para Supabase y API keys de administración.

## 📈 Despliegue
El proyecto se encuentra live en la siguiente plataforma:
https://nicte-munecas-web.vercel.app/

---
Desarrollado por **Erick Eduardo Ramos** - 2026.
