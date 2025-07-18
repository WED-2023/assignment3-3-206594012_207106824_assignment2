<template>
  <div class="container-fluid py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-header bg-success text-white text-center">
            <h3 class="mb-0">
              <i class="bi bi-box-arrow-in-right"></i> Login to the Site
            </h3>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="login" novalidate>
              <!-- Username Field -->
              <div class="mb-3">
                <label for="username" class="form-label">
                  <i class="bi bi-person"></i> Username
                </label>
                <input
                  id="username"
                  v-model="state.username"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.username.$error, 'is-valid': !v$.username.$error && state.username }"
                  placeholder="Enter username"
                  @blur="v$.username.$touch()"
                />
                <div v-if="v$.username.$error" class="invalid-feedback">
                  <div v-if="v$.username.required.$invalid">Username is required</div>
                  <div v-if="v$.username.minLength.$invalid">Username must be at least 3 characters</div>
                  <div v-if="v$.username.maxLength?.$invalid">Username must be at most 8 characters</div>
                  <div v-if="v$.username.isAlpha?.$invalid">Username can contain only letters</div>
                </div>
              </div>

              <!-- Password Field -->
              <div class="mb-3">
                <label for="password" class="form-label">
                  <i class="bi bi-lock"></i> Password
                </label>
                <div class="input-group">
                  <input
                    id="password"
                    v-model="state.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    :class="{ 'is-invalid': v$.password.$error, 'is-valid': !v$.password.$error && state.password }"
                    placeholder="Enter password"
                    @blur="v$.password.$touch()"
                  />
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="showPassword = !showPassword"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div v-if="v$.password.$error" class="invalid-feedback">
                  <div v-if="v$.password.required.$invalid">Password is required</div>
                  <div v-if="v$.password.minLength.$invalid">Password must be at least 5 characters</div>
                  <div v-if="v$.password.maxLength?.$invalid">Password must be at most 10 characters</div>
                  <div v-if="v$.password.hasNumber?.$invalid">Password must contain at least one number</div>
                  <div v-if="v$.password.hasSpecialChar?.$invalid">Password must contain at least one special character (!@#$%^&*)</div>
                </div>
              </div>

              <!-- Remember Me Checkbox -->
              <div class="mb-3 form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="rememberMe"
                  v-model="rememberMe"
                />
                <label class="form-check-label" for="rememberMe">
                  Remember me
                </label>
              </div>

              <!-- Submit Button -->
              <div class="d-grid gap-2">
                <button
                  type="submit"
                  class="btn btn-success btn-lg"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                  {{ loading ? 'Logging in...' : 'Login' }}
                </button>
              </div>
            </form>

            <!-- Register Link -->
            <div class="text-center mt-3">
              <p class="mb-0">
                Don't have an account?
                <router-link to="/register" class="text-decoration-none">
                  <i class="bi bi-person-plus"></i> Register here
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';
import { useRouter } from 'vue-router';

export default {
  name: "LoginPage",
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const showPassword = ref(false);
    const rememberMe = ref(false);

    const state = reactive({
      username: '',
      password: '',
    });

    const isAlpha = helpers.regex(/^[A-Za-z]+$/);
    const hasNumber = helpers.regex(/[0-9]/);
    const hasSpecialChar = helpers.regex(/[!@#$%^&*]/);

    const rules = {
      username: {
        required,
        minLength: minLength(3),
        maxLength: helpers.withMessage("Username must be at most 8 characters", v => v.length <= 8),
        isAlpha: helpers.withMessage("Username can contain only letters", isAlpha)
      },
      password: {
        required,
        minLength: minLength(5),
        maxLength: helpers.withMessage("Password must be at most 10 characters", v => v.length <= 10),
        hasNumber: helpers.withMessage("Password must contain at least one number", hasNumber),
        hasSpecialChar: helpers.withMessage("Password must contain at least one special character (!@#$%^&*)", hasSpecialChar)
      }
    };

    const v$ = useVuelidate(rules, state);

    const login = async () => {
      const isValid = await v$.value.$validate();

      if (!isValid) {
        window.toast('Error', 'Please fix the errors in the form', 'danger');
        return;
      }

      loading.value = true;

      try {
        await window.axios.post('/login', {
          username: state.username,
          password: state.password
        }, { withCredentials: true });

        localStorage.removeItem('user');
        window.store.login(state.username);
        localStorage.setItem('username', state.username);

        if (rememberMe.value) {
          localStorage.setItem('rememberMe', 'true');
          // localStorage.setItem('username', state.username);
        } else {
          localStorage.removeItem('rememberMe');
          
        }

        window.toast("Login successful", `Welcome ${state.username}!`, "success");
        router.push('/');
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'An error occurred';
        window.toast("Error", errorMessage, "danger");
      } finally {
        loading.value = false;
      }
    };

    const loadRememberedUser = () => {
      if (localStorage.getItem('rememberMe') === 'true') {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
          state.username = savedUsername;
          rememberMe.value = true;
        }
      }
    };

    loadRememberedUser();

    return {
      state,
      v$,
      login,
      loading,
      showPassword,
      rememberMe
    };
  }
};
</script>

<style scoped>
.card {
  border: none;
  border-radius: 15px;
}
.card-header {
  border-radius: 15px 15px 0 0 !important;
  border-bottom: none;
}
.form-control:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
}
.btn-success {
  border-radius: 8px;
  font-weight: 600;
}
.btn-success:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 135, 84, 0.3);
}
.input-group .btn {
  border-left: none;
}
.input-group .form-control {
  border-right: none;
}
.input-group .form-control:focus {
  border-right: none;
  box-shadow: none;
}
.input-group .btn:focus {
  box-shadow: none;
}
.form-check-input:checked {
  background-color: #198754;
  border-color: #198754;
}
.form-check-input:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
}
a {
  color: #198754;
}
a:hover {
  color: #146c43;
}
</style>
