<template>
  <div class="auth-widget">
    <!-- Loading state -->
    <div
      v-if="loading"
      class="auth-loading"
    >
      <span class="spinner" />
    </div>

    <!-- Authenticated user -->
    <div
      v-else-if="isAuthenticated"
      class="auth-user"
    >
      <div class="user-info">
        <span class="user-display">{{ userDisplayName }}</span>
        <button
          class="btn btn-outline btn-sm"
          @click="handleSignOut"
        >
          Sign Out
        </button>
      </div>
    </div>

    <!-- Guest user -->
    <div
      v-else
      class="auth-guest"
    >
      <button
        class="btn btn-primary btn-sm"
        @click="showSignIn = true"
      >
        Sign In
      </button>
      <button
        class="btn btn-outline btn-sm"
        @click="showSignUp = true"
      >
        Sign Up
      </button>
    </div>

    <!-- Sign In Modal -->
    <div
      v-if="showSignIn"
      class="modal-overlay"
      @click="closeModals"
    >
      <div
        class="modal-content"
        @click.stop
      >
        <div class="modal-header">
          <h2>Sign In</h2>
          <button
            class="modal-close"
            @click="closeModals"
          >
            &times;
          </button>
        </div>

        <form
          class="auth-form"
          @submit.prevent="handleSignIn"
        >
          <button
            type="button"
            class="btn btn-google btn-full"
            @click="handleGoogleSignIn"
          >
            <svg
              class="google-icon"
              viewBox="0 0 24 24"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div class="divider">
            <span>or</span>
          </div>

          <div class="form-group">
            <label for="signin-email">Email</label>
            <input
              id="signin-email"
              v-model="signInForm.email"
              type="email"
              required
              class="form-control"
              placeholder="Enter your email"
            >
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
            >
          </div>

          <div
            v-if="error"
            class="alert alert-error"
          >
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary btn-full"
          >
            <span
              v-if="loading"
              class="spinner"
            />
            {{ loading ? "Signing In..." : "Sign In" }}
          </button>
        </form>

        <p class="auth-switch">
          Don't have an account?
          <a
            href="#"
            @click="switchToSignUp"
          >Sign Up</a>
        </p>
      </div>
    </div>

    <!-- Sign Up Modal -->
    <div
      v-if="showSignUp"
      class="modal-overlay"
      @click="closeModals"
    >
      <div
        class="modal-content"
        @click.stop
      >
        <div class="modal-header">
          <h2>Sign Up</h2>
          <button
            class="modal-close"
            @click="closeModals"
          >
            &times;
          </button>
        </div>

        <form
          class="auth-form"
          @submit.prevent="handleSignUp"
        >
          <button
            type="button"
            class="btn btn-google btn-full"
            @click="handleGoogleSignIn"
          >
            <svg
              class="google-icon"
              viewBox="0 0 24 24"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div class="divider">
            <span>or</span>
          </div>

          <div class="form-group">
            <label for="signup-email">Email</label>
            <input
              id="signup-email"
              v-model="signUpForm.email"
              type="email"
              required
              class="form-control"
              placeholder="Enter your email"
            >
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
            >
          </div>

          <div class="form-group">
            <label for="signup-name">Full Name (Optional)</label>
            <input
              id="signup-name"
              v-model="signUpForm.name"
              type="text"
              class="form-control"
              placeholder="Enter your full name"
            >
          </div>

          <div
            v-if="error"
            class="alert alert-error"
          >
            {{ error }}
          </div>

          <div
            v-if="signUpSuccess"
            class="alert alert-success"
          >
            Account created! Please check your email to verify your account.
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary btn-full"
          >
            <span
              v-if="loading"
              class="spinner"
            />
            {{ loading ? "Creating Account..." : "Sign Up" }}
          </button>
        </form>

        <p class="auth-switch">
          Already have an account?
          <a
            href="#"
            @click="switchToSignIn"
          >Sign In</a>
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
      "userDisplayName",
      "loading",
      "error",
    ]),
  },

  watch: {
    showSignIn() {
      this.clearError();
    },
    showSignUp() {
      this.clearError();
    },
  },

  methods: {
    ...mapActions("auth", ["signIn", "signUp", "signOut", "clearError", "signInWithGoogle"]),

    async handleGoogleSignIn() {
      try {
        await this.signInWithGoogle();
      } catch {
        // Error is handled by the store
      }
    },

    async handleSignIn() {
      try {
        await this.signIn(this.signInForm);
        this.closeModals();
        this.resetForms();
      } catch {
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
      } catch {
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

.user-display {
  font-size: 0.9rem;
  opacity: 0.9;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #ffffff;
  color: #333333;
  border: 1px solid #d1d5db;
  font-weight: 500;
}

.btn-google:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.google-icon {
  width: 18px;
  height: 18px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 16px 0;
  color: var(--text-color, #9ca3af);
  font-size: 0.85rem;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--border-color, #d1d5db);
}

.divider span {
  padding: 0 12px;
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

[data-theme="dark"] .btn-google {
  background: #374151;
  color: #f9fafb;
  border-color: #4b5563;
}

[data-theme="dark"] .btn-google:hover {
  background: #4b5563;
}

[data-theme="dark"] .divider {
  color: #9ca3af;
}

[data-theme="dark"] .divider::before,
[data-theme="dark"] .divider::after {
  background: #4b5563;
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
