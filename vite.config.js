import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        register: "register.html",
        login: "show-login.html",
        user: "user-only-page.html"
      }
    }
  }
});