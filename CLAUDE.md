# CLAUDE.md — Wask-Business-App (Web de proveedores)

> Contexto para asistentes de IA. Portal web para **ADMIN** y **BUSINESS_OWNER**.
> Consume `API-Wask` (ver su `CLAUDE.md` para el contrato de API completo).

## Qué es

Portal web (React) donde:
- **BUSINESS_OWNER** gestiona su tienda: cambia datos del negocio, crea productos, stock, ve pedidos y ventas.
- **ADMIN** aprueba/rechaza negocios y productos, ve reportes globales.

Los productos y tiendas que aquí se crean son los que el **cliente ve en la app móvil** (`App-Frontend-Wask`).
`CUSTOMER` y `DELIVERY` están **bloqueados** en este portal (usan la app móvil).

## Stack

- React 19 + TypeScript + Vite 8
- React Router v7
- Tailwind CSS v4 (+ PostCSS)
- Lucide React (iconos)
- Sin librería de estado global: **React Context + hooks**

## Comandos

```bash
npm install
npm run dev       # Vite → http://localhost:5173
npm run build     # tsc -b && vite build
npm run lint
npm run preview
```

## Variables de entorno (.env en la raíz)

```
VITE_API_BASE_URL=http://localhost:3000/api/v1   # requerido
VITE_APP_NAME=Wask Business App
VITE_ENABLE_MOCKS=false
```
Usar `import.meta.env`, nunca `process.env`. Todas las públicas empiezan con `VITE_`.

## Estructura

```
src/
├── App.tsx                 # rutas (/admin/*, /business/*) con ProtectedRoute por rol
├── main.tsx
├── context/AuthContext.tsx # sesión global: login, logout, user, isLoading
├── components/
│   ├── ProtectedRoute.tsx  # verifica auth + rol requerido
│   ├── AsyncSection.tsx    # envoltura loading/error/retry
│   ├── admin/              # AdminLayout, Sidebar, Header, RequestTable
│   └── business/           # BusinessLayout, Sidebar, Header, StatsCard, ProductTable...
├── pages/
│   ├── admin/     # Dashboard, Solicitudes, Proveedores, Productos, Reportes, Configuracion
│   └── business/  # BusinessDashboard, Productos, Pedidos, Entregas, Ventas, Inventario, Reportes, Configuracion
├── services/               # capa API (una función por endpoint)
├── hooks/useApiResource.ts # { data, loading, error, refetch }
└── types/api.ts            # tipos del contrato (User, Business, Product, Order...)
```

## Capa de red (services/)

- **`apiClient.ts`**: cliente fetch tipado. Métodos `get/post/patch/put/delete`.
  - Agrega `Authorization: Bearer` automáticamente (salvo `skipAuth`).
  - En 401 hace **un** intento de refresh (`/auth/refresh-token`) y reintenta; si falla, limpia tokens y redirige a `/`.
  - Desenvuelve el envelope `{ success, data }` y devuelve `data`. Lanza `ApiError` en fallo.
- **`env.ts`**: lee `VITE_*`. Exige `VITE_API_BASE_URL`.
- **`tokenStorage.ts`**: access/refresh token en localStorage.
- Servicios: `authService, productsService, ordersService, businessService, dashboardService,`
  `inventoryService, analyticsService, notificationsService, settingsService, suppliersService(deprecado)`.

## Auth y roles

- Login llama `/auth/login` → guarda tokens → `/users/me` para el usuario.
- `AuthContext.buildLoginError` bloquea CUSTOMER/DELIVERY y estados PENDING/SUSPENDED/REJECTED.
- Solo entran `ADMIN` y `BUSINESS_OWNER` con negocio válido.
- Registro (`/auth/register-business-owner`) crea cuenta PENDING; **no** emite tokens (espera aprobación admin).

## Contrato de API (resumen — ver CLAUDE.md del backend)

Base: `/api/v1`. Envelope `{ success, data, timestamp }`. El backend usa `forbidNonWhitelisted`:
**enviar solo los campos del DTO** o responde 400.

Endpoints usados: `/auth/*`, `/users/me`, `/business/*`, `/products/*`, `/orders*`,
`/inventory/*`, `/dashboard/summary`, `/admin/overview`, `/analytics/*`, `/notifications`, `/settings`.

## Estado de conexión (corregido 2026-07)

- ✅ `businessService.getBusinessById(id)` → ahora existe `GET /business/:id` (solo ADMIN) en backend.
- ✅ `productsService.getProduct(id)` → ahora existe `GET /products/:id` en backend.
- Pendiente menor: `suppliersService` usa `/suppliers/*` (controlador **vacío/deprecado**) y
  `types/api.ts` conserva tipos `Supplier*`. No se usan en flujos activos; migrar/eliminar cuando se toque.

## Convenciones

- Cargar datos con `useApiResource(fetchFn)` + `<AsyncSection>` para estados.
- Nuevos endpoints → agregar método al service correspondiente (no llamar `fetch` directo en componentes).
- Nuevos tipos → `types/api.ts`. Nuevas rutas → `App.tsx` envueltas en `<ProtectedRoute requiredRole=...>`.
