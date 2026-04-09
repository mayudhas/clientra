<template>
<div class="container-fluid">
    <div class="row">
        <div class="col-xl-7 b-center bg-size" :style="{ backgroundImage: 'url('+ require('../../assets/images/login/2.jpg') +')' }" style="background-size: cover; background-position: center center; display: block;">
            <img class="bg-img-cover bg-center" src="../../assets/images/login/2.jpg" alt="loginpage" style="display: none;" />
        </div>
        <div class="col-xl-5 p-0">
            <div class="login-card">
                <div>
                    <div>
                        <a class="logo text-start">
                            <img class="img-fluid for-light" src="../../assets/images/logo/logo.png" alt="looginpage" />
                            <img class="img-fluid for-dark" src="../../assets/images/logo/logo_dark.png" alt="looginpage" />
                        </a>
                    </div>
                    <div class="login-main ">
                        <form class="theme-form" @submit.prevent="handleLogin">
                            <h4>Sign in to account</h4>
                            <p>Enter your email & password to login</p>
                            
                            <!-- Error Prompt -->
                            <div v-if="errorMessage" class="alert alert-danger" role="alert">
                                {{ errorMessage }}
                            </div>

                            <div class="form-group">
                                <label class="col-form-label">Email Address</label>
                                <input class="form-control" type="email" required="" placeholder="Test@gmail.com" v-model="user.email" />
                            </div>
                            <div class="form-group">
                                <label class="col-form-label">Password</label>
                                <div class="form-input position-relative">
                                    <input class="form-control" :type="active?'password':'text'" required="" placeholder="*********" v-model="user.password" />
                                    <div class="show-hide"><span :class="active?'show':'hide'"  @click.prevent="show"></span></div>
                                </div>
                            </div>
                            <div class="form-group mb-0">
                                <div class="checkbox p-0">
                                    <input id="checkbox1" type="checkbox" />
                                    <label class="text-muted" for="checkbox1">Remember password</label>
                                </div>
                                <button type="submit" class="btn btn-primary btn-block w-100" :disabled="loading">
                                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    {{ loading ? 'Signing in...' : 'Sign in' }}
                                </button>
                            </div>
                            <h6 class="text-muted mt-4 or">Or Sign in with</h6>
                            <div class="social mt-4">
                                <div class="btn-showcase">
                                    <a class="btn btn-light" href="#" ><vue-feather class="txt-linkedin" type="linkedin"></vue-feather> LinkedIn </a>
                                    <a class="btn btn-light" href="#" ><vue-feather class="txt-twitter" type="twitter"></vue-feather>twitter</a>
                                    <a class="btn btn-light" href="#" ><vue-feather class="txt-fb" type="facebook"></vue-feather>facebook</a>
                                </div>
                              </div>
                            <p class="mt-4 mb-0 text-center">
                                Don't have account?
                                <router-link class="ms-2" tag="a" to="/auth/register">
                                    Create Account
                                </router-link>
                            </p>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    data() {
        return {
            active: true,
            user: {
                email: '',
                password: ''
            },
            loading: false,
            errorMessage: ''
        }
    },
    methods: {
        show() {
            this.active = !this.active;
        },
        handleLogin() {
            this.loading = true;
            this.errorMessage = '';
            
            this.$store.dispatch('auth/login', this.user)
                .then(() => {
                    this.$router.push('/');
                })
                .catch(error => {
                    this.loading = false;
                    this.errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                });
        }
    }
}
</script>
