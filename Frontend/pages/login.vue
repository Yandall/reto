<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col align-self="center" cols="1">
        <h2>Logins</h2>
      </v-col>
    </v-row>
    <v-row align-content="center"  justify="center">
      <v-col cols="6" align-self="center" >
        <v-form  ref="login" v-model="valid" lazy-validation>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Password"
            hint="At least 8 characters"
            @click:append="show1 = !show1"
          ></v-text-field>

          <v-btn
            :disabled="!valid"
            class="mr-4"
            @click="login"
            type="submit"
            outlined
            color="primary"
          >
            Login
          </v-btn>
          <v-btn color="primary" to="/inspire"> Register </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    show1: false,
    email: "",
    password: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 6 || "Min 6 characters",
    },
  }),

  methods: {
    login() {
      this.$refs.login.validate();
    },
  },
};
</script>