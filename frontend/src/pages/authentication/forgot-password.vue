<script setup lang="ts">
import Logo from '@/layouts/full/logo/LogoDark.vue';
import AuthForgotPassword from '@/components/authentication/authForms/AuthForgotPassword.vue';
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
                      <h2 class="text-secondary mt-8">Forgot Password?</h2>
                      <h4 class="text-disabled mt-3 mb-6">Enter your email and we'll send you a link to reset your password.</h4>
                    </v-col>
                  </v-row>
                  
                  <AuthForgotPassword />
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
