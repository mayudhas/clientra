<script setup lang="ts">
import Logo from '@/layouts/full/logo/LogoDark.vue';
import AuthResetPassword from '@/components/authentication/authForms/AuthResetPassword.vue';
</script>

<template>
  <v-row class="h-screen" gap="0">
    <v-col cols="12" class="d-flex align-center bg-lightprimary">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" lg="10" xl="6" md="7">
            <v-card elevation="0" class="loginBox">
              <v-card variant="outlined">
                <v-card-text class="pa-9">
                  <v-row>
                    <v-col cols="12" class="text-center">
                      <Logo />
                      <h2 class="text-secondary mt-8">Reset Password</h2>
                      <h4 class="text-disabled mt-3 mb-6">Enter your new password below to reset your account credentials.</h4>
                    </v-col>
                  </v-row>
                  
                  <AuthResetPassword />
                </v-card-text>
              </v-card>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<style lang="scss">
.loginBox {
  max-width: 475px;
  margin: 0 auto;
}
</style>
