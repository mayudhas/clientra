<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import { useRouter } from 'vue-router';
import Google from '@/assets/images/auth/social-google.svg';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const router = useRouter();

const checkbox = ref(false);
const show1 = ref(false);
const password = ref('');
const email = ref('');
const Regform = ref();
const firstname = ref('');
const lastname = ref('');
const tenantName = ref('');
const setupKey = ref('');

const passwordRules = ref([
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length >= 6) || 'Password must be at least 6 characters'
]);
const emailRules = ref([(v: string) => !!v || 'E-mail is required', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);

async function handleSubmit() {
  const { valid } = await Regform.value.validate();
  if (!valid) return;

  try {
    await authStore.register({
      email: email.value,
      password: password.value,
      name: `${firstname.value} ${lastname.value}`,
      tenantName: tenantName.value,
      setupKey: setupKey.value
    });
    
    notificationStore.showSuccess('Registration successful! Please login.');
    router.push('/authentication/login');
  } catch (err: any) {
    notificationStore.showError(err.response?.data?.message || err.message || 'Registration failed');
  }
}
</script>

<template>
  <v-btn block color="primary" variant="outlined" class="text-lightText googleBtn">
    <img :src="Google" alt="google" />
    <span class="ml-2">Sign up with Google</span></v-btn
  >
  <v-row>
    <v-col class="d-flex align-center">
      <v-divider class="custom-devider" />
      <v-btn variant="outlined" class="orbtn" rounded="md" size="small">OR</v-btn>
      <v-divider class="custom-devider" />
    </v-col>
  </v-row>
  <h5 class="text-center my-4 mb-8">Sign up with Email address</h5>
  <v-form ref="Regform" @submit.prevent="handleSubmit" class="mt-7 loginForm">
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field v-model="firstname" hide-details="auto" label="Firstname" variant="outlined" color="primary"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="lastname" hide-details="auto" label="Lastname" variant="outlined" color="primary"></v-text-field>
      </v-col>
    </v-row>
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="Email Address*"
      class="mt-4"
      required
      hide-details="auto"
      variant="outlined"
      color="primary"
    ></v-text-field>
    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="Password*"
      class="mt-4"
      required
      hide-details="auto"
      :append-inner-icon="show1 ? '$eye' : '$eyeOff'"
      :type="show1 ? 'text' : 'password'"
      @click:append-inner="show1 = !show1"
      variant="outlined"
      color="primary"
    ></v-text-field>

    <v-divider class="my-6" />
    <p class="text-caption text-medium-emphasis mb-2">Registration Details</p>
    
    <v-text-field
      v-model="tenantName"
      label="Company / Tenant Name"
      hint="Required for standard users"
      persistent-hint
      class="mb-4"
      variant="outlined"
      color="primary"
      hide-details="auto"
    ></v-text-field>

    <v-text-field
      v-model="setupKey"
      label="Setup Key (Super Admin Only)"
      type="password"
      variant="outlined"
      color="primary"
      hide-details="auto"
    ></v-text-field>

    <div class="d-sm-inline-flex align-center mt-2 mb-7 mb-sm-0 font-weight-bold">
      <v-checkbox
        v-model="checkbox"
        :rules="[(v: any) => !!v || 'You must agree to continue!']"
        label="I agree to the Terms and Condition"
        required
        color="primary"
        class="ms-n2"
        hide-details
      ></v-checkbox>
    </div>
    
    <v-btn 
      color="secondary" 
      block 
      class="mt-2" 
      variant="flat" 
      size="large" 
      type="submit"
      :loading="authStore.loading"
      :disabled="authStore.loading"
    >Sign Up</v-btn>
  </v-form>
  <div class="mt-5 text-right">
    <v-divider />
    <v-btn variant="plain" to="/authentication/login" class="mt-2 text-capitalize mr-n2">Already have an account?</v-btn>
  </div>
</template>
<style lang="scss">
.custom-devider {
  border-color: rgba(0, 0, 0, 0.08) !important;
}
.googleBtn {
  border-color: rgba(0, 0, 0, 0.08);
  margin: 30px 0 20px 0;
}
.outlinedInput .v-field {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: none;
}
.orbtn {
  padding: 2px 40px;
  border-color: rgba(0, 0, 0, 0.08);
  margin: 20px 15px;
}
</style>
