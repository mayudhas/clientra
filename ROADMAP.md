# 🗺️ ROADMAP PENGEMBANGAN CLIENTRA CRM

> Dokumen ini berisi alur pengembangan secara **urut, bertahap, dan detail**.
> Setiap fase dikerjakan satu per satu secara code generating.
> Cukup bilang: **"Kerjakan Fase X"** untuk memulai.

---

## 📊 AUDIT CODEBASE SAAT INI

### ✅ Modul yang Sudah Selesai (Backend + Frontend)

| Modul | Backend | Frontend | Keterangan |
|-------|---------|----------|------------|
| Auth | ✅ Selesai | ✅ Selesai | Login, Register, Forgot Password, Reset Password, Refresh Token, Logout |
| Users | ✅ Selesai | ✅ Selesai | CRUD User, Profile, Change Password, UserFormDialog |
| Tenants | ✅ Selesai | ✅ Selesai | CRUD Tenant, Stats, TenantFormDialog, DeleteTenantDialog |

### ⚠️ Modul Setengah Jadi

| Modul | Backend | Frontend | Keterangan |
|-------|---------|----------|------------|
| Clients | ✅ CRUD Lengkap (Controller, Service, Repository, DTO) | ❌ Data Hardcoded (dummy) | Perlu hubungkan frontend ke API |
| Projects | ❌ Hanya Entity + Module kosong | ❌ Data Hardcoded (dummy) | Perlu buat backend + frontend |
| Invoices | ❌ Hanya Entity + Module kosong | ❌ Data Hardcoded (dummy) | Perlu buat backend + frontend |

### ❌ Modul Belum Ada

| Modul | Keterangan |
|-------|------------|
| Project Tasks | Entity, API, dan UI belum ada sama sekali |
| Invoice Items | Entity, API, dan UI belum ada sama sekali |
| Dashboard Dinamis | UI ada tapi semua data dummy statis |
| Settings Page | Halaman routing ada tapi konten kosong |

### 📁 Pola (Pattern) yang Sudah Ditetapkan

**Backend:**
- Entity: Extends `BaseEntity`, UUID primary key, kolom prefix nama tabel (contoh: `clients_name`)
- Repository: Extends `CoreRepository<T>`, inject TypeORM `Repository<T>`
- Service: Extends `CoreService<T>`, inject custom Repository
- Controller: `@UseGuards(JwtAuthGuard)`, ambil `tenantId` dari `req.user.tenantId`
- DTO: Menggunakan `class-validator` decorators
- Module: `TypeOrmModule.forFeature([Entity])`, export Service + Repository

**Frontend:**
- API Service: Object literal, gunakan `api` dari `@/services/api.ts`
- Store: Pinia `defineStore`, state + actions pattern
- Page: `<script setup lang="ts">`, gunakan store, breadcrumbs, `UiParentCard`
- Dialog: Props `show`, `editMode`, `tenantData`, Emits `update:show`, `saved`
- Icons: Gunakan `vue-tabler-icons`
- Router: File-based routing via `vue-router/auto-routes`

---

## 📋 ALUR PENGEMBANGAN (12 FASE)

---

### ─── 🟢 FASE 1: CLIENT — HUBUNGKAN FRONTEND KE BACKEND [x] ─────────────────
- [x] 1.1: Buat `client.service.ts` untuk komunikasi API di frontend.
- [x] 1.2: Buat Pinia store `stores/clients.ts` untuk manajemen state client.
- [x] 1.3: Integrasikan API ke `clients.vue` (List, Search, Pagination).
- [x] 1.4: Implementasikan `ClientFormDialog.vue` (Create & Update).
- [x] 1.5: Implementasikan `DeleteClientDialog.vue` (Delete Confirmation).
- [x] 1.6: Integrasikan Super Admin tenant selection logic.

---

## ─── 🟡 FASE 2: PROJECT — BACKEND CRUD [ ] ──────────────────────────────
| # | File | Tipe | Keterangan |
|---|------|------|------------|
| 1.1 | `frontend/src/services/client.service.ts` | **BARU** | API service untuk CRUD client |
| 1.2 | `frontend/src/stores/clients.ts` | **BARU** | Pinia store untuk state management client |
| 1.3 | `frontend/src/pages/(main)/crm/clients.vue` | **UPDATE** | Ganti data dummy → ambil dari API |
| 1.4 | `frontend/src/pages/(main)/crm/components/ClientFormDialog.vue` | **BARU** | Dialog untuk Create/Edit client |
| 1.5 | `frontend/src/pages/(main)/crm/components/DeleteClientDialog.vue` | **BARU** | Dialog konfirmasi hapus client |

#### Detail per File:

**1.1 — `client.service.ts`**
```
- Interface: Client (id, name, email, company, phone, address, notes, status, tenantId, createdAt, updatedAt)
- Methods:
  - getClients()          → GET /api/clients
  - getClientById(id)     → GET /api/clients/:id
  - createClient(payload) → POST /api/clients
  - updateClient(id, payload) → PATCH /api/clients/:id
  - deleteClient(id)      → DELETE /api/clients/:id
```

**1.2 — `clients.ts` (Pinia Store)**
```
- State: clients[], loading, error
- Actions: fetchClients, createClient, updateClient, deleteClient
- Pattern: Ikuti pola stores/tenants.ts
```

**1.3 — `clients.vue` (Update)**
```
- Hapus data hardcoded items
- Import store, load data di onMounted
- Tambah dialog triggers (openCreate, openEdit, confirmDelete)
- Tambah komponen dialog
- Gunakan v-data-table (bukan server karena belum ada pagination di backend)
```

**1.4 — `ClientFormDialog.vue`**
```
- Form fields: name*, email*, company, phone, address, notes, status (dropdown: active/inactive)
- Validation: name required, email valid format
- Pattern: Ikuti TenantFormDialog.vue
```

**1.5 — `DeleteClientDialog.vue`**
```
- Konfirmasi dialog dengan nama client
- Pattern: Ikuti DeleteTenantDialog.vue
```

#### Verifikasi Fase 1:
- [ ] Buka halaman Clients → data muncul dari database
- [ ] Klik "Add Client" → form dialog muncul → submit → data tersimpan
- [ ] Klik edit → data terisi di form → update berhasil
- [ ] Klik delete → konfirmasi → data dihapus

---

### FASE 2: PROJECT — BACKEND CRUD [x] ──────────────────────────────
> **Status**: Hanya ada Entity dan Module kosong
> **Goal**: API CRUD untuk Project yang lengkap
> **Estimasi**: ~30 menit

**Kenapa kedua?** Project bergantung pada Client (relasi ManyToOne). Client harus selesai dulu.

#### File yang Dibuat/Diubah:

| # | File | Tipe | Keterangan |
|---|------|------|------------|
| 2.1 | `backend/src/app/projects/entities/project.entity.ts` | **UPDATE** | Tambah field status, description, deadline |
| 2.2 | `backend/src/app/projects/dto/create-project.dto.ts` | **BARU** | DTO untuk create project |
| 2.3 | `backend/src/app/projects/dto/update-project.dto.ts` | **BARU** | DTO untuk update project |
| 2.4 | `backend/src/app/projects/projects.repository.ts` | **BARU** | Repository extends CoreRepository |
| 2.5 | `backend/src/app/projects/projects.service.ts` | **BARU** | Service extends CoreService |
| 2.6 | `backend/src/app/projects/projects.controller.ts` | **BARU** | Controller dengan JwtAuthGuard |
| 2.7 | `backend/src/app/projects/projects.module.ts` | **UPDATE** | Daftarkan semua provider |
| 2.8 | Migration file | **BARU** | Auto-generate dari perubahan entity |

#### Detail per File:

**2.1 — `project.entity.ts` (Update)**
```
Field yang ditambahkan:
- description: text, nullable
- status: enum ['planning', 'in_progress', 'on_hold', 'completed', 'cancelled'], default 'planning'
- deadline: date, nullable

Relasi yang sudah ada (tetap):
- ManyToOne → Client (clientId)
- ManyToOne → Tenant (tenantId)
```

**2.2 — `create-project.dto.ts`**
```
Fields:
- name: @IsString, @IsNotEmpty
- description: @IsString, @IsOptional
- clientId: @IsUUID, @IsNotEmpty
- status: @IsEnum, @IsOptional (default: 'planning')
- deadline: @IsDateString, @IsOptional
- progress: @IsNumber, @IsOptional, @Min(0), @Max(100)
```

**2.3 — `update-project.dto.ts`**
```
- PartialType(CreateProjectDto)
```

**2.4 — `projects.repository.ts`**
```
- Extends CoreRepository<Project>
- Inject Repository<Project>
- Pattern: Ikuti clients.repository.ts
```

**2.5 — `projects.service.ts`**
```
Methods:
- createProject(dto, tenantId) → set tenantId, save
- findAllByTenant(tenantId) → filter by tenantId, include relasi client
- findOneByTenant(id, tenantId) → filter by id + tenantId
- updateProject(id, dto, tenantId) → validasi ownership, update
- removeProject(id, tenantId) → validasi ownership, delete
```

**2.6 — `projects.controller.ts`**
```
Endpoints:
- POST   /api/projects         → create
- GET    /api/projects         → findAll (by tenant)
- GET    /api/projects/:id     → findOne (by tenant)
- PATCH  /api/projects/:id     → update
- DELETE /api/projects/:id     → delete
```

#### Verifikasi Fase 2:
- [ ] `curl POST /api/projects` → project terbuat
- [ ] `curl GET /api/projects` → hanya project milik tenant user
- [ ] `curl PATCH /api/projects/:id` → update berhasil
- [ ] `curl DELETE /api/projects/:id` → hapus berhasil

---

### FASE 3: PROJECT — FRONTEND UI
> **Status**: Halaman ada tapi data dummy
> **Goal**: Frontend untuk CRUD Project terhubung ke API
> **Estimasi**: ~30 menit

#### File yang Dibuat/Diubah:

| # | File | Tipe | Keterangan |
|---|------|------|------------|
| 3.1 | `frontend/src/services/project.service.ts` | **BARU** | API service |
| 3.2 | `frontend/src/stores/projects.ts` | **BARU** | Pinia store |
| 3.3 | `frontend/src/pages/(main)/crm/projects.vue` | **UPDATE** | Hubungkan ke API |
| 3.4 | `frontend/src/pages/(main)/crm/components/ProjectFormDialog.vue` | **BARU** | Dialog Create/Edit |
| 3.5 | `frontend/src/pages/(main)/crm/components/DeleteProjectDialog.vue` | **BARU** | Dialog hapus |

#### Detail per File:

**3.1 — `project.service.ts`**
```
- Interface: Project (id, name, description, status, clientId, client?, progress, deadline, tenantId, createdAt, updatedAt)
- Methods: getProjects, getProjectById, createProject, updateProject, deleteProject
```

**3.4 — `ProjectFormDialog.vue`**
```
Form fields:
- name (text, required)
- description (textarea, optional)
- client (v-autocomplete dropdown, load dari clients store, required)
- status (v-select: Planning, In Progress, On Hold, Completed, Cancelled)
- deadline (v-date-input / text-field type date)
- progress (v-slider 0-100)
```

#### Verifikasi Fase 3:
- [ ] Halaman Projects menampilkan data dari API
- [ ] Form Create bisa memilih Client dari dropdown
- [ ] Edit dan Delete berfungsi

---

### FASE 4: PROJECT TASKS (FITUR BARU)
> **Status**: Belum ada sama sekali
> **Goal**: Sistem task/checklist di dalam project
> **Estimasi**: ~45 menit

#### File yang Dibuat:

| # | File | Tipe | Layer |
|---|------|------|-------|
| 4.1 | `backend/src/app/projects/entities/task.entity.ts` | **BARU** | Backend |
| 4.2 | `backend/src/app/projects/dto/create-task.dto.ts` | **BARU** | Backend |
| 4.3 | `backend/src/app/projects/dto/update-task.dto.ts` | **BARU** | Backend |
| 4.4 | `backend/src/app/projects/tasks.repository.ts` | **BARU** | Backend |
| 4.5 | `backend/src/app/projects/tasks.service.ts` | **BARU** | Backend |
| 4.6 | `backend/src/app/projects/tasks.controller.ts` | **BARU** | Backend |
| 4.7 | `backend/src/app/projects/entities/project.entity.ts` | **UPDATE** | Backend |
| 4.8 | `backend/src/app/projects/projects.module.ts` | **UPDATE** | Backend |
| 4.9 | Migration file | **BARU** | Backend |
| 4.10 | `frontend/src/services/task.service.ts` | **BARU** | Frontend |
| 4.11 | `frontend/src/pages/(main)/crm/projects/[id].vue` | **BARU** | Frontend |
| 4.12 | `frontend/src/pages/(main)/crm/components/TaskFormDialog.vue` | **BARU** | Frontend |

#### Detail:

**4.1 — `task.entity.ts`**
```
Kolom:
- id: UUID (tasks_id)
- title: varchar (tasks_title)
- description: text, nullable (tasks_description)
- status: enum ['todo', 'in_progress', 'done'] (tasks_status), default 'todo'
- projectId: UUID (tasks_project_id)
- tenantId: UUID (tasks_tenant_id)
- createdAt, updatedAt

Relasi:
- ManyToOne → Project (projectId) — CASCADE DELETE
- ManyToOne → Tenant (tenantId)
```

**4.5 — `tasks.service.ts`**
```
Methods:
- createTask(dto, projectId, tenantId)
- findAllByProject(projectId, tenantId)
- updateTask(id, dto, tenantId)
- removeTask(id, tenantId)
- Bonus: Auto-recalculate project progress = (done tasks / total tasks) × 100
```

**4.6 — `tasks.controller.ts`**
```
Endpoints (nested under projects):
- POST   /api/projects/:projectId/tasks
- GET    /api/projects/:projectId/tasks
- PATCH  /api/projects/:projectId/tasks/:taskId
- DELETE /api/projects/:projectId/tasks/:taskId
```

**4.11 — `projects/[id].vue` (Project Detail Page)**
```
Layout:
- Header: Nama project, status badge, progress bar
- Info section: Client, deadline, description
- Task List: Tabel/list task dengan checkbox, status, actions
- Tombol: Add Task, Edit Project, Back
```

#### Verifikasi Fase 4:
- [ ] Klik project → masuk halaman detail
- [ ] Bisa tambah, edit, hapus task
- [ ] Progress project otomatis ter-update berdasarkan task yang selesai

---

### FASE 5: INVOICES — BACKEND CRUD
> **Status**: Hanya ada Entity dan Module kosong
> **Goal**: API CRUD untuk Invoice yang lengkap
> **Estimasi**: ~30 menit

#### File yang Dibuat/Diubah:

| # | File | Tipe | Keterangan |
|---|------|------|------------|
| 5.1 | `backend/src/app/invoices/entities/invoice.entity.ts` | **UPDATE** | Tambah field + relasi Project |
| 5.2 | `backend/src/app/invoices/dto/create-invoice.dto.ts` | **BARU** | DTO create |
| 5.3 | `backend/src/app/invoices/dto/update-invoice.dto.ts` | **BARU** | DTO update |
| 5.4 | `backend/src/app/invoices/invoices.repository.ts` | **BARU** | Repository |
| 5.5 | `backend/src/app/invoices/invoices.service.ts` | **BARU** | Service + auto-generate nomor invoice |
| 5.6 | `backend/src/app/invoices/invoices.controller.ts` | **BARU** | Controller |
| 5.7 | `backend/src/app/invoices/invoices.module.ts` | **UPDATE** | Register providers |
| 5.8 | Migration file | **BARU** | Schema update |

#### Detail:

**5.1 — `invoice.entity.ts` (Update)**
```
Field yang ditambahkan:
- invoiceNo: varchar, unique per tenant (invoices_invoice_no)
- dueDate: date, nullable (invoices_due_date)
- notes: text, nullable (invoices_notes)
- projectId: UUID, nullable (invoices_project_id) — relasi opsional ke Project

Field yang sudah ada (update jika perlu):
- amount: decimal (invoices_amount)
- status: enum ['draft', 'pending', 'paid', 'overdue', 'cancelled'] (invoices_status)

Relasi:
- ManyToOne → Client (clientId)
- ManyToOne → Tenant (tenantId)
- ManyToOne → Project (projectId, nullable)  ← BARU
```

**5.5 — `invoices.service.ts`**
```
Methods:
- createInvoice(dto, tenantId) → auto-generate invoiceNo: "INV-{YYYY}-{sequence}"
- findAllByTenant(tenantId) → include relasi client & project
- findOneByTenant(id, tenantId)
- updateInvoice(id, dto, tenantId)
- removeInvoice(id, tenantId)
```

#### Verifikasi Fase 5:
- [ ] Create invoice → nomor otomatis ter-generate
- [ ] Invoice bisa di-link ke Project (opsional)
- [ ] CRUD berfungsi penuh

---

### FASE 6: INVOICE ITEMS (FITUR BARU)
> **Status**: Belum ada sama sekali
> **Goal**: Rincian barang/jasa di dalam invoice
> **Estimasi**: ~30 menit

#### File yang Dibuat:

| # | File | Tipe | Keterangan |
|---|------|------|------------|
| 6.1 | `backend/src/app/invoices/entities/invoice-item.entity.ts` | **BARU** | Entity |
| 6.2 | `backend/src/app/invoices/dto/create-invoice-item.dto.ts` | **BARU** | DTO |
| 6.3 | `backend/src/app/invoices/entities/invoice.entity.ts` | **UPDATE** | Tambah relasi OneToMany ke items |
| 6.4 | `backend/src/app/invoices/invoices.service.ts` | **UPDATE** | Auto-hitung total amount dari items |
| 6.5 | `backend/src/app/invoices/invoices.module.ts` | **UPDATE** | Register entity baru |
| 6.6 | Migration file | **BARU** | Create invoice_items table |

#### Detail:

**6.1 — `invoice-item.entity.ts`**
```
Kolom:
- id: UUID (invoice_items_id)
- description: varchar (invoice_items_description)
- quantity: integer (invoice_items_quantity)
- unitPrice: decimal (invoice_items_unit_price)
- invoiceId: UUID (invoice_items_invoice_id)
- createdAt, updatedAt

Relasi:
- ManyToOne → Invoice (invoiceId) — CASCADE DELETE
```

**6.4 — `invoices.service.ts` (Update)**
```
Logic yang ditambahkan:
- Saat create invoice dengan items → hitung total = SUM(qty × unitPrice)
- Saat update items → recalculate total amount
- Items dikirim sebagai nested array dalam create/update invoice DTO
```

#### Verifikasi Fase 6:
- [ ] Create invoice dengan items → total otomatis terhitung
- [ ] Update items → total otomatis ter-recalculate
- [ ] Delete invoice → items ikut terhapus (cascade)

---

### FASE 7: INVOICES — FRONTEND UI
> **Status**: Halaman ada tapi data dummy
> **Goal**: Frontend lengkap untuk invoice + items
> **Estimasi**: ~45 menit

#### File yang Dibuat/Diubah:

| # | File | Tipe | Keterangan |
|---|------|------|------------|
| 7.1 | `frontend/src/services/invoice.service.ts` | **BARU** | API service |
| 7.2 | `frontend/src/stores/invoices.ts` | **BARU** | Pinia store |
| 7.3 | `frontend/src/pages/(main)/crm/invoices.vue` | **UPDATE** | Hubungkan ke API |
| 7.4 | `frontend/src/pages/(main)/crm/components/InvoiceFormDialog.vue` | **BARU** | Dialog Create/Edit + line items |
| 7.5 | `frontend/src/pages/(main)/crm/components/DeleteInvoiceDialog.vue` | **BARU** | Dialog hapus |
| 7.6 | `frontend/src/pages/(main)/crm/invoices/[id].vue` | **BARU** | Halaman detail invoice |

#### Detail:

**7.4 — `InvoiceFormDialog.vue`**
```
Form fields:
- client (v-autocomplete, required)
- project (v-autocomplete, optional, filter by selected client)
- dueDate (date picker)
- status (v-select: Draft, Pending, Paid, Overdue, Cancelled)
- notes (textarea)
- --- separator ---
- Invoice Items (dynamic table):
  - Tombol "Add Item"
  - Per baris: Description (text), Quantity (number), Unit Price (number), Subtotal (computed), Hapus
  - Footer: Total Amount (auto-sum)
```

**7.6 — `invoices/[id].vue` (Invoice Detail Page)**
```
Layout (tampilan seperti invoice cetak):
- Header: Invoice No, Tanggal, Due Date, Status badge
- Info: From (tenant info), To (client info)
- Table: List items (description, qty, price, subtotal)
- Footer: Total amount
- Actions: Edit, Print/PDF, Delete
```

#### Verifikasi Fase 7:
- [ ] Halaman Invoice menampilkan data real dari API
- [ ] Form dialog bisa menambah item secara dinamis
- [ ] Total terhitung otomatis
- [ ] Halaman detail invoice tampil rapi

---

### FASE 8: DASHBOARD DINAMIS
> **Status**: UI ada tapi semua data statis/dummy
> **Goal**: Dashboard menampilkan data agregat real dari API
> **Estimasi**: ~45 menit

#### File yang Dibuat/Diubah:

| # | File | Tipe | Keterangan |
|---|------|------|------------|
| 8.1 | `backend/src/app/dashboard/dashboard.module.ts` | **BARU** | Module |
| 8.2 | `backend/src/app/dashboard/dashboard.service.ts` | **BARU** | Aggregate queries |
| 8.3 | `backend/src/app/dashboard/dashboard.controller.ts` | **BARU** | Endpoint stats |
| 8.4 | `backend/src/app.module.ts` | **UPDATE** | Register DashboardModule |
| 8.5 | `frontend/src/services/dashboard.service.ts` | **BARU** | API service |
| 8.6 | `frontend/src/components/dashboard/default/TotalEarning.vue` | **UPDATE** | Data real |
| 8.7 | `frontend/src/components/dashboard/default/TotalOrder.vue` | **UPDATE** | Data real |
| 8.8 | `frontend/src/components/dashboard/default/TotalIncome.vue` | **UPDATE** | Data real |
| 8.9 | `frontend/src/components/dashboard/default/TotalGrowth.vue` | **UPDATE** | Data real |
| 8.10 | `frontend/src/components/dashboard/default/PopularStocks.vue` | **UPDATE** | Ganti jadi "Recent Projects" atau "Top Clients" |
| 8.11 | `frontend/src/pages/(main)/dashboard/default.vue` | **UPDATE** | Koneksi ke API |

#### Detail:

**8.2 — `dashboard.service.ts` (Backend)**
```
Endpoint: GET /api/dashboard/stats

Response:
{
  totalClients: number,
  totalProjects: number,
  totalInvoices: number,
  totalRevenue: number,          // SUM invoice (status = paid)
  pendingRevenue: number,        // SUM invoice (status = pending/overdue)
  activeProjects: number,        // Projects status = in_progress
  completedProjects: number,
  recentProjects: Project[],     // 5 project terbaru
  recentInvoices: Invoice[],     // 5 invoice terbaru
  monthlyRevenue: {month, amount}[] // Revenue per bulan (12 bulan terakhir)
}
```

**8.6–8.10 — Komponen Dashboard (Update)**
```
- TotalEarning → Total Revenue (paid invoices)
- TotalOrder → Total Projects
- TotalIncome → Pending Revenue
- TotalGrowth → Chart monthly revenue
- PopularStocks → Recent Projects / Recent Invoices list
```

#### Verifikasi Fase 8:
- [ ] Dashboard menampilkan angka real sesuai data di database
- [ ] Chart menampilkan trend bulanan

---

### FASE 9: SETTINGS & PROFILE
> **Status**: Halaman ada tapi konten kosong
> **Goal**: Halaman settings fungsional
> **Estimasi**: ~20 menit

#### File yang Diubah:

| # | File | Tipe | Keterangan |
|---|------|------|------------|
| 9.1 | `frontend/src/pages/(main)/settings.vue` | **UPDATE** | Implementasi halaman settings |
| 9.2 | `frontend/src/pages/(main)/profile.vue` | **UPDATE** | Tambah statistik user |

#### Detail:

**9.1 — `settings.vue`**
```
Konten:
- Section 1: Tenant Info (nama tenant, jumlah user, jumlah client)
  - Hanya admin yang bisa edit nama tenant
- Section 2: Account Settings (email, password)
  - Link ke Change Password dialog
- Section 3: Theme Preferences
  - Dark mode toggle, sidebar color, mini sidebar toggle
  - Menggunakan customizer store yang sudah ada
```

**9.2 — `profile.vue`**
```
Layout:
- Card profil: Avatar (inisial), Nama, Email, Role badge
- Stats cards: Jumlah project, jumlah client, jumlah invoice yang ditangani
- Recent Activity: 5 project terbaru user
```

#### Verifikasi Fase 9:
- [ ] Settings halaman berfungsi semua
- [ ] Profil menampilkan data real

---

### FASE 10: POLISH & UX
> **Goal**: Pengalaman pengguna yang mulus dan profesional
> **Estimasi**: ~30 menit

#### Detail Pekerjaan:

| # | Task | Keterangan |
|---|------|------------|
| 10.1 | Loading States | Skeleton loader di semua tabel dan card |
| 10.2 | Empty States | Ilustrasi/pesan saat belum ada data ("No clients yet, add your first!") |
| 10.3 | Error Handling | Snackbar notifikasi konsisten di semua CRUD |
| 10.4 | Responsif | Test dan fix layout di mobile/tablet |
| 10.5 | Navigasi | Breadcrumb links berfungsi, sidebar active state benar |
| 10.6 | Konfirmasi | Semua aksi destructive punya konfirmasi dialog |

---

### FASE 11: TESTING & QUALITY
> **Goal**: Pastikan aplikasi stabil dan aman
> **Estimasi**: ~45 menit

| # | Task | Keterangan |
|---|------|------------|
| 11.1 | Unit Test Backend | Test semua service (create, read, update, delete) |
| 11.2 | Data Isolation Test | Buat 2 tenant, pastikan data tidak bocor antar tenant |
| 11.3 | Auth Guard Test | Akses tanpa token → 401, akses role berbeda → 403 |
| 11.4 | E2E Flow Test | Login → Buat Client → Buat Project + Task → Buat Invoice + Items |
| 11.5 | Edge Cases | Hapus client yang punya project → error handling, input invalid, dll |

---

### FASE 12: PRODUCTION DEPLOYMENT
> **Goal**: Siap deploy ke server production
> **Estimasi**: ~30 menit

| # | Task | Keterangan |
|---|------|------------|
| 12.1 | Backend Dockerfile | Multi-stage build, production optimized |
| 12.2 | Frontend Dockerfile | Build statis + Nginx |
| 12.3 | docker-compose.prod.yml | Config production (no volumes mount, env vars) |
| 12.4 | Environment Variables | Pisahkan .env.production |
| 12.5 | Database Backup | Script backup PostgreSQL |
| 12.6 | Deploy | Deploy ke VPS / cloud |

---

## 📊 RINGKASAN TOTAL

| Fase | Nama | Fokus | Estimasi |
|------|------|-------|----------|
| 1 | Client Frontend ↔ Backend | Frontend | ~30 mnt |
| 2 | Project Backend CRUD | Backend | ~30 mnt |
| 3 | Project Frontend UI | Frontend | ~30 mnt |
| 4 | Project Tasks | Full-stack | ~45 mnt |
| 5 | Invoice Backend CRUD | Backend | ~30 mnt |
| 6 | Invoice Items | Backend | ~30 mnt |
| 7 | Invoice Frontend UI | Frontend | ~45 mnt |
| 8 | Dashboard Dinamis | Full-stack | ~45 mnt |
| 9 | Settings & Profile | Frontend | ~20 mnt |
| 10 | Polish & UX | Frontend | ~30 mnt |
| 11 | Testing & Quality | Full-stack | ~45 mnt |
| 12 | Production Deployment | DevOps | ~30 mnt |
| | **TOTAL** | | **~6.5 jam** |

---

> 💡 **Cara Pakai**: Cukup bilang **"Kerjakan Fase 1"** untuk memulai fase pertama.
> Setiap kali selesai satu fase, kita verifikasi dulu sebelum lanjut ke fase berikutnya.
