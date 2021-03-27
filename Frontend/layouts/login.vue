<template>
  <v-app>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-toolbar-title v-text="title"/>
    </v-app-bar>
    <v-main>
      <v-container fill-height>
        <nuxt />
      </v-container>
    </v-main>
    
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
    data () {
        return {
            title: "Reto Vuetify",
            clipped: false,
            fixed: false,
        }
    }
}
</script>