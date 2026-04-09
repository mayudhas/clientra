<template>
  <div>
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5>Daftar Klien</h5>
            <div class="d-flex">
              <input 
                type="text" 
                class="form-control me-2" 
                placeholder="Cari klien..." 
                v-model="searchTerm"
              />
              <button class="btn btn-primary" @click="openCreateModal">
                <i class="fa fa-plus me-2"></i>Tambah Klien
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid View -->
    <div class="row list-persons">
      <div v-if="loading" class="col-12 text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <div v-else-if="filteredClients.length === 0" class="col-12 text-center py-5">
        <p class="text-muted">Tidak ada klien ditemukan.</p>
      </div>

      <div 
        v-else 
        class="col-xl-4 col-sm-6" 
        v-for="client in filteredClients" 
        :key="client.id"
      >
        <div class="card social-profile">
          <div class="card-body">
            <div class="social-img-wrap text-center mb-3">
              <div class="avatar-initials">
                {{ getInitials(client.name) }}
              </div>
            </div>
            <div class="social-details text-center">
              <h5 class="mb-1">{{ client.name }}</h5>
              <span class="f-light d-block mb-1">{{ client.company || 'Pribadi' }}</span>
              <p class="mb-2 text-muted f-12">{{ client.email }}</p>
              
              <div class="mb-3">
                <span :class="['badge', client.status === 'active' ? 'badge-primary' : 'badge-light']">
                  {{ client.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                </span>
              </div>

              <div class="d-flex justify-content-center gap-2">
                <button class="btn btn-outline-primary btn-xs" @click="openEditModal(client)">
                  <i class="fa fa-pencil me-1"></i>Edit
                </button>
                <button class="btn btn-outline-danger btn-xs" @click="confirmDelete(client)">
                  <i class="fa fa-trash me-1"></i>Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div class="modal fade" id="clientModal" tabindex="-1" role="dialog" :class="{ 'show d-block': showModal }" v-if="showModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? 'Edit Klien' : 'Tambah Klien Baru' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveClient">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Nama Lengkap *</label>
                <input type="text" class="form-control" v-model="form.name" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Email *</label>
                <input type="email" class="form-control" v-model="form.email" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Perusahaan</label>
                <input type="text" class="form-control" v-model="form.company" />
              </div>
              <div class="mb-3">
                <label class="form-label">Nomor Telepon</label>
                <input type="text" class="form-control" v-model="form.phone" />
              </div>
              <div class="mb-3">
                <label class="form-label">Alamat</label>
                <textarea class="form-control" v-model="form.address" rows="2"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Status</label>
                <select class="form-select" v-model="form.status">
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Catatan</label>
                <textarea class="form-control" v-model="form.notes" rows="2"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Batal</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    </div>
  </div>
</template>

<script>
import ClientsService from '../../services/clients.service';

export default {
  name: 'ClientsIndex',
  data() {
    return {
      clients: [],
      loading: false,
      saving: false,
      searchTerm: '',
      showModal: false,
      isEdit: false,
      currentId: null,
      form: {
        name: '',
        email: '',
        company: '',
        phone: '',
        address: '',
        notes: '',
        status: 'active'
      }
    };
  },
  computed: {
    filteredClients() {
      if (!this.searchTerm) return this.clients;
      const term = this.searchTerm.toLowerCase();
      return this.clients.filter(c => 
        c.name.toLowerCase().includes(term) || 
        (c.company && c.company.toLowerCase().includes(term)) ||
        c.email.toLowerCase().includes(term)
      );
    }
  },
  mounted() {
    this.fetchClients();
  },
  methods: {
    fetchClients() {
      this.loading = true;
      ClientsService.getAll()
        .then(res => {
          this.clients = res.data.result; 
        })
        .catch(err => {
          console.error('Error fetching clients:', err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getInitials(name) {
      if (!name) return '??';
      return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    },
    openCreateModal() {
      this.isEdit = false;
      this.currentId = null;
      this.form = {
        name: '',
        email: '',
        company: '',
        phone: '',
        address: '',
        notes: '',
        status: 'active'
      };
      this.showModal = true;
    },
    openEditModal(client) {
      this.isEdit = true;
      this.currentId = client.id;
      this.form = { ...client };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    saveClient() {
      this.saving = true;
      const promise = this.isEdit 
        ? ClientsService.update(this.currentId, this.form)
        : ClientsService.create(this.form);

      promise
        .then(() => {
          this.closeModal();
          this.fetchClients();
          // Ideally show a toast here
        })
        .catch(err => {
          alert('Error saving client: ' + (err.response?.data?.message || err.message));
        })
        .finally(() => {
          this.saving = false;
        });
    },
    confirmDelete(client) {
      if (confirm(`Apakah Anda yakin ingin menghapus klien ${client.name}?`)) {
        ClientsService.delete(client.id)
          .then(() => {
            this.fetchClients();
          })
          .catch(err => {
            alert('Error deleting client: ' + err.message);
          });
      }
    }
  }
};
</script>

<style scoped>
.avatar-initials {
  width: 80px;
  height: 80px;
  background-color: #7366ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  border-radius: 50%;
  margin: 0 auto;
}
.social-profile .card-body {
  padding: 30px;
}
.modal-backdrop {
  z-index: 1040;
}
.modal {
  z-index: 1050;
  background: rgba(0,0,0,0.5);
}
</style>
