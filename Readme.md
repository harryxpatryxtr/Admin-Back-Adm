# Traza Admin API

Backend HTTP basado en Koa, MongoDB y JWT.

## Configuración local

1. Copiar `.env.example` a `.env`.
2. Configurar `MONGODB_URI` y generar un `JWT_SECRET` aleatorio de al menos 32 bytes. No reutilizar una clave del repositorio.
3. Instalar dependencias con `npm ci` y arrancar con `npm run dev`.

Variables principales:

| Variable | Uso |
| --- | --- |
| `MONGODB_URI` | URI de MongoDB. Obligatoria al arrancar. |
| `JWT_SECRET` | Clave HMAC para tokens; mínimo 32 bytes. Obligatoria. |
| `JWT_EXPIRE` | Vigencia del token de acceso; predeterminado `15m`. |
| `JWT_REFRESH_EXPIRE` | Vigencia del token de renovación; predeterminado `7d`. |
| `PORT` | Puerto HTTP; predeterminado `3001`. |
| `CORS_ORIGINS` | Orígenes permitidos separados por coma. En producción es obligatorio. |
| `TRUST_PROXY` | Usa cabeceras del proxy para determinar IP/HTTPS. Activar solo detrás de un proxy de confianza que sobrescriba esas cabeceras. |
| `PUBLIC_REGISTRATION_ENABLED` | Habilita `/api/auth/register`; predeterminado `false`. Los registros públicos no reciben un rol. |

La variable `JWT_SECRET` debe inyectarse desde el gestor de secretos del entorno. `.env` y otros archivos locales quedan excluidos de Git.

## Crear el administrador inicial

En una instalación nueva, las rutas administrativas deniegan el acceso hasta asignar permisos. Crear el primer administrador con el comando de bootstrap, proporcionando `BOOTSTRAP_ADMIN_USER`, `BOOTSTRAP_ADMIN_EMAIL` y `BOOTSTRAP_ADMIN_PASSWORD` mediante el entorno seguro del despliegue:

```sh
npm run bootstrap:admin
```

El comando crea el rol `super-admin`, las claves de permiso documentadas abajo y la cuenta indicada. Es idempotente para la misma cuenta; si ya existe otro administrador inicial, aborta.

## Autenticación y autorización

- `POST /api/auth/login` devuelve `accessToken` y `refreshToken`.
- Enviar el token de acceso como `Authorization: Bearer <accessToken>`.
- `POST /api/auth/refresh` recibe `{ "refreshToken": "..." }`, rota el token y devuelve un nuevo par. Un refresh token anterior no se puede reutilizar.
- `POST /api/auth/logout` invalida el refresh token vigente. Los access tokens ya emitidos expiran por sí solos.
- `GET /api/auth/me` devuelve el usuario autenticado con sus roles activos y sus claves de permiso, para que el cliente adapte la interfaz.
- Las cuentas con `state: 0` o `isActive: false` no pueden iniciar sesión ni usar un token ya emitido.
- El registro público permanece desactivado salvo que se configure `PUBLIC_REGISTRATION_ENABLED=true`.
- El rate limiter es local al proceso; en despliegues con varias réplicas, complementarlo con límites equivalentes en el gateway o un almacén compartido. Configurar `TRUST_PROXY=true` solo si el tráfico llega exclusivamente a través de un proxy de confianza.

Las rutas protegidas necesitan un rol activo y una asignación activa de permiso. El campo `Permission.id` (o, por compatibilidad, `Permission.name`) debe coincidir con una de estas claves:

```text
domain:create                 domain:update                 domain:read
user-type:create              user-type:update              user-type:read
document-type:create          document-type:update          document-type:read
position:create               position:update               position:read
permission:create             permission:update             permission:read
role:create                   role:update                   role:read
role:permissions:update
user:create                   user:update                   user:read
user:assign-role
```

Las asociaciones usuario-rol se almacenan en `UserRole`; rol-permiso, en `PermissionRole`. Los endpoints de usuarios están disponibles bajo `/api/user` y la consulta de usuarios está paginada (`page`, `limit`, máximo 100). Los usuarios se devuelven con `roles` y con los catálogos (`idTypeUser`, `idTypeDocument`, `idTypeCargo`) poblados. Los roles se asignan con `POST /api/user/assignRole` y se quitan con `POST /api/user/unassignRole` (`{ id, roleId }`). `PUT /api/user/update` acepta `state` y `password`; ambos cambios revocan el refresh token del usuario, y nadie puede desactivar su propia cuenta.

## Calidad

- `npm test`: pruebas automatizadas de validación, tokens y rate limiting.
- `npm run lint`: análisis estático con ESLint.

## Notas de despliegue y migración

- Rota las credenciales de base de datos que hayan aparecido en versiones anteriores del ejemplo de entorno y revisa el historial de Git si el repositorio fue compartido. Quitar una credencial de la versión actual no la elimina del historial.
- Los tokens emitidos antes del cambio de formato deben renovarse iniciando sesión de nuevo.
- Antes del despliegue, comprobar que no existan asignaciones duplicadas de una misma pareja usuario-rol o rol-permiso; ahora hay índices únicos compuestos para garantizar esa integridad.
- Los campos heredados de usuario (`username`, `lastName`, `role`, `isActive`) se leen temporalmente para facilitar la migración. Los nuevos datos usan `user`, apellidos separados, `UserRole` y `state`; planificar la migración y posterior retirada de compatibilidad.
