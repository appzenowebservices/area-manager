// src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ActivityLog }    from "./activityStore";
import { setSession, clearSession, recordLoginAttempt, checkLoginLock } from "./sessionStore";

/**
 * AuthStore
 * - Login with attempt tracking (3 fails = 15 min lock)
 * - Logout with activity log
 * - PIN for session unlock (default: 1234)
 */

// Demo credentials — replace with API call in production
const VALID_USERS = [
  { id: "AM-001", name: "Rajesh Kumar",  email: "rajesh@add.com",  password: "admin123", pin: "1234", role: "area_manager", area: "Lucknow North" },
  { id: "AM-002", name: "Priya Sharma",  email: "priya@add.com",   password: "priya456", pin: "5678", role: "area_manager", area: "Lucknow South" },
];

const useAuthStore = create(
  persist(
    (set, get) => ({
      user:            null,
      isAuthenticated: false,
      loginError:      null,
      lockInfo:        null,   // { locked, lockedUntil, remainingMs }

      login: (email, password) => {
        // Check if account is locked
        const lockStatus = checkLoginLock();
        if (lockStatus.locked) {
          const mins = Math.ceil(lockStatus.remainingMs / 60000);
          set({
            loginError: `Too many failed attempts. Account locked for ${mins} more minute${mins > 1 ? "s" : ""}.`,
            lockInfo: lockStatus,
          });
          return false;
        }

        const user = VALID_USERS.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (user) {
          recordLoginAttempt(true); // clears attempt counter
          setSession({ userId: user.id, name: user.name, role: user.role });
          ActivityLog.login(user.name);

          const { password: _, ...safeUser } = user;
          set({ user: safeUser, isAuthenticated: true, loginError: null, lockInfo: null });
          return true;
        } else {
          const result = recordLoginAttempt(false);
          const attemptsLeft = 3 - result.attempts;

          let errMsg = "";
          if (result.locked) {
            errMsg = "Too many failed attempts. Account locked for 15 minutes.";
          } else {
            errMsg = `Invalid email or password. ${attemptsLeft} attempt${attemptsLeft !== 1 ? "s" : ""} remaining.`;
          }

          set({ loginError: errMsg, lockInfo: result });
          return false;
        }
      },

      logout: (reason = "Manual") => {
        const { user } = get();
        if (user) ActivityLog.logout(user.name, reason);
        clearSession();
        set({ user: null, isAuthenticated: false, loginError: null, lockInfo: null });
      },

      clearError: () => set({ loginError: null }),

      updateUser: (partial) =>
        set((state) => ({ user: { ...(state.user || {}), ...partial } })),

      // Check lock status (call on mount)
      refreshLockStatus: () => {
        const lockStatus = checkLoginLock();
        set({ lockInfo: lockStatus.locked ? lockStatus : null });
      },
    }),
    {
      name: "am_auth",
      partialize: (state) => ({
        user:            state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
