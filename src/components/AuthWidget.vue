<template>
  <div class="auth-widget">
    <!-- Loading state -->
    <div v-if="loading" class="auth-loading">
      <span class="spinner"></span>
    </div>

    <!-- Authenticated user -->
    <div v-else-if="isAuthenticated" class="auth-user">
      <div class="user-info">
        <span class="user-email">{{ userEmail }}</span>
        <button @click="handleSignOut" class="btn btn-outline btn-sm">
          Sign Out
        </button>
      </div>
    </div>

    <!-- Guest user -->
    <div v-else class="auth-guest">
      <button @click="showSignIn = true" class="btn btn-primary btn-sm">
        Sign In
      </button>
      <button @click="showSignUp = true" class="btn btn-outline btn-sm">
        Sign Up
      </button>
    </div>

    <!-- Sign In Modal -->
    <div v-if="showSignIn" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Sign In</h2>
          <button @click="closeModals" class="modal-close">&times;</button>
        </div>

        <form @submit.prevent="handleSignIn" class="auth-form">
          <div class="form-group">
            <label for="signin-email">Email</label>
            <input
              id="signin-email"
              v-model="signInForm.email"
              type="email"
              required
              class="form-control"
              placeholder="Enter your email"
            />
          </div>

          <div class="form-group">
            <label for="signin-password">Password</label>
            <input
              id="signin-password"
              v-model="signInForm.password"
              type="password"
              required
              class="form-control"
              placeholder="Enter your password"
            />
          </div>

          <div v-if="error" class="alert alert-error">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary btn-full"
          >
            <span v-if="loading" class="spinner"></span>
            {{ loading ? "Signing In..." : "Sign In" }}
          </button>
        </form>

        <p class="auth-switch">
          Don't have an account?
          <a href="#" @click="switchToSignUp">Sign Up</a>
        </p>
      </div>
    </div>

    <!-- Sign Up Modal -->
    <div v-if="showSignUp" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Sign Up</h2>
          <button @click="closeModals" class="modal-close">&times;</button>
        </div>

        <form @submit.prevent="handleSignUp" class="auth-form">
          <div class="form-group">
            <label for="signup-email">Email</label>
            <input
              id="signup-email"
              v-model="signUpForm.email"
              type="email"
              required
              class="form-control"
              placeholder="Enter your email"
            />
          </div>

          <div class="form-group">
            <label for="signup-password">Password</label>
            <input
              id="signup-password"
              v-model="signUpForm.password"
              type="password"
              required
              minlength="6"
              class="form-control"
              placeholder="Enter a password (min 6 characters)"
            />
          </div>

          <div class="form-group">
            <label for="signup-name">Full Name (Optional)</label>
            <input
              id="signup-name"
              v-model="signUpForm.name"
              type="text"
              class="form-control"
              placeholder="Enter your full name"
            />
          </div>

          <div v-if="error" class="alert alert-error">
            {{ error }}
          </div>

          <div v-if="signUpSuccess" class="alert alert-success">
            Account created! Please check your email to verify your account.
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary btn-full"
          >
            <span v-if="loading" class="spinner"></span>
            {{ loading ? "Creating Account..." : "Sign Up" }}
          </button>
        </form>

        <p class="auth-switch">
          Already have an account?
          <a href="#" @click="switchToSignIn">Sign In</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AuthWidget",

  data() {
    return {
      showSignIn: false,
      showSignUp: false,
      signUpSuccess: false,
      signInForm: {
        email: "",
        password: "",
      },
      signUpForm: {
        email: "",
        password: "",
        name: "",
      },
    };
  },

  computed: {
    ...mapGetters("auth", [
      "isAuthenticated",
      "user",
      "userEmail",
      "loading",
      "error",
    ]),
  },

  methods: {
    ...mapActions("auth", ["signIn", "signUp", "signOut", "clearError"]),

    async handleSignIn() {
      try {
        await this.signIn(this.signInForm);
        this.closeModals();
        this.resetForms();
      } catch (error) {
        // Error is handled by the store
      }
    },

    async handleSignUp() {
      try {
        await this.signUp({
          email: this.signUpForm.email,
          password: this.signUpForm.password,
          userData: this.signUpForm.name
            ? { full_name: this.signUpForm.name }
            : {},
        });
        this.signUpSuccess = true;
        setTimeout(() => {
          this.closeModals();
          this.resetForms();
        }, 3000);
      } catch (error) {
        // Error is handled by the store
      }
    },

    async handleSignOut() {
      try {
        await this.signOut();
      } catch (error) {
        console.error("Error signing out:", error);
      }
    },

    closeModals() {
      this.showSignIn = false;
      this.showSignUp = false;
      this.signUpSuccess = false;
      this.clearError();
    },

    switchToSignUp() {
      this.showSignIn = false;
      this.showSignUp = true;
      this.clearError();
    },

    switchToSignIn() {
      this.showSignUp = false;
      this.showSignIn = true;
      this.signUpSuccess = false;
      this.clearError();
    },

    resetForms() {
      this.signInForm = { email: "", password: "" };
      this.signUpForm = { email: "", password: "", name: "" };
    },
  },

  watch: {
    // Clear error when switching between modals
    showSignIn() {
      this.clearError();
    },
    showSignUp() {
      this.clearError();
    },
  },
};
</script>

<style scoped>
.auth-widget {
  display: flex;
  align-items: center;
  gap: 10px;
}

.auth-loading {
  padding: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-email {
  font-size: 0.9rem;
  opacity: 0.9;
}

.auth-guest {
  display: flex;
  gap: 8px;
}

/* Button styles */
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.8rem;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
}

.btn-outline {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-full {
  width: 100%;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-content {
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #000000);
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  margin: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 10000;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-color, #666666);
  opacity: 0.7;
  padding: 4px 8px;
  line-height: 1;
}

.modal-close:hover {
  opacity: 1;
}

/* Form styles */
.auth-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: var(--text-color, #333333);
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color, #d1d5db);
  border-radius: 6px;
  background: var(--input-bg, #ffffff);
  color: var(--text-color, #000000);
  font-size: 1rem;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Alert styles */
.alert {
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.alert-error {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.alert-success {
  background: #dcfce7;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

/* Dark theme support */
[data-theme="dark"] .modal-content {
  background: #1f2937;
  color: #f9fafb;
}

[data-theme="dark"] .modal-header h2 {
  color: #f9fafb;
}

[data-theme="dark"] .modal-close {
  color: #f9fafb;
}

[data-theme="dark"] .form-group label {
  color: #f9fafb;
}

[data-theme="dark"] .form-control {
  background: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

[data-theme="dark"] .form-control::placeholder {
  color: #9ca3af;
}

[data-theme="dark"] .auth-switch {
  color: #d1d5db;
}

[data-theme="dark"] .auth-switch a {
  color: #818cf8;
}

[data-theme="dark"] .alert-error {
  background: #dc262620;
  color: #f87171;
  border: 1px solid #dc262630;
}

[data-theme="dark"] .alert-success {
  background: #16a34a20;
  color: #4ade80;
  border: 1px solid #16a34a30;
}

.auth-switch {
  text-align: center;
  margin: 0;
  font-size: 0.9rem;
}

.auth-switch a {
  color: #667eea;
  text-decoration: none;
}

.auth-switch a:hover {
  text-decoration: underline;
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .user-email {
    display: none;
  }

  .modal-content {
    margin: 10px;
    padding: 20px;
  }
}
</style>
