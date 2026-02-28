# 📂 HelpDesk API (Backend)

Esta carpeta contiene el núcleo de la aplicación desarrollado con **Laravel 11/12**. Se encarga de la lógica de negocio, autenticación persistente, gestión de colas y almacenamiento de datos.

---

## 🚀 Requisitos del Sistema

- **PHP 8.2+** con extensiones `pdo_pgsql`, `pgsql`, `redis`.
- **PostgreSQL** como motor de base de datos.
- **Redis Server** para manejo de caché y colas de mensajería.

---

## 🛠️ Instalación y Configuración

Sigue estos pasos dentro de la carpeta `/back`:

### 1. Preparar el Entorno
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
```

### 2. Configurar Base de Datos (PostgreSQL)
Edita tu .env con las credenciales locales:


``` bash
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=helpdesk_db
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
```

### 3. Configurar Redis
Es vital para el cumplimiento de los requisitos técnicos del proyecto:


```bash
CACHE_STORE=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```
### 4. Poblar Base de Datos

Ejecuta las migraciones y los seeders para crear los usuarios de prueba:

```Bash
php artisan migrate --seed
```

Usuarios de prueba:

- Agente: agent@test.com / password

- Cliente: customer@test.com / password

### ⚙️ Servicios en Ejecución
Para que el backend funcione al 100%, asegúrate de tener activos:

- Servidor API: php artisan serve

- Procesador de Colas (Obligatorio para comentarios):

```Bash

php artisan queue:work
```

- Redis Server: (Asegúrate que el servicio esté corriendo en Laragon o Docker).

### 🏗️ Arquitectura y Decisiones Técnicas
- Autenticación: Implementada con JWT-Auth para permitir una comunicación stateless con el frontend.

- Caché (Redis): Se cachea el listado de tickets por 60s. La llave de caché es dinámica, variando según: user_id, role, page, status y search.

- Procesamiento Asíncrono: La creación de comentarios dispara un Job (NotifyNewComment) enviado a Redis, demostrando el manejo de tareas pesadas fuera del ciclo de respuesta HTTP.

- Seguridad: Uso estricto de Laravel Policies para asegurar que los clientes no accedan a tickets ajenos y que solo los agentes modifiquen estados.

- Persistencia de Preferencias: Uso de Cookies HTTP para almacenar el tema visual (light/dark), cumpliendo con el requisito de almacenamiento fuera de la base de datos.
