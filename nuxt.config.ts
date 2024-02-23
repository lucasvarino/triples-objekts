// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/image"],
  runtimeConfig: {
    public: {
      COSMO_URL: process.env.COSMO_URL || "",
      ARTISTS_URL: process.env.ARTISTS_URL || "",
    },
  },
});
