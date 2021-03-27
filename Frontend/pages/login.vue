<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col align-self="center" cols="1">
        <h2>Login</h2>
      </v-col>
    </v-row>
    <v-row align-content="center" justify="center">
      <v-col cols="6" align-self="center">
        <v-form ref="login" v-model="validLogin" lazy-validation>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[passwordRules.required, passwordRules.min]"
            :type="show1 ? 'text' : 'password'"
            label="Password"
            hint="At least 6 characters"
            @click:append="show1 = !show1"
          ></v-text-field>

          <v-btn
            :disabled="!validLogin"
            class="mr-4"
            @click="login"
            outlined
            color="primary"
          >
            Login
          </v-btn>
          <v-dialog v-model="registerDialog" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                Register
              </v-btn>
            </template>
            <v-card>
              <v-form ref="register" v-model="validRegister" lazy-validation>
                <v-card-title>
                  <span class="headline">Register new User</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="name"
                          label="Legal first name*"
                          :rules="[rules.required]"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="lastname"
                          label="Legal last name*"
                          :rules="[rules.required]"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="newEmail"
                          label="Email*"
                          prepend-inner-icon="mdi-email"
                          :rules="emailRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="newPassword"
                          label="Password*"
                          prepend-inner-icon="mdi-key-variant"
                          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show2 ? 'text' : 'password'"
                          @click:append="show2 = !show2"
                          :rules="[passwordRules.required, passwordRules.min]"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-select
                          v-model="type_id"
                          :items="['CC', 'TI', 'other']"
                          label="Identification type*"
                          :rules="[rules.required]"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="id"
                          label="Identification*"
                          prepend-inner-icon="mdi-card-account-details-outline"
                          :rules="[rules.required]"
                          required
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="phone"
                          label="Phone number*"
                          :rules="phoneRules"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="registerDialog = false"
                  >
                    Close
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="register">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-form>
              <v-col cols="auto">
                <v-alert 
                :value="alert" 
                :type="alertType"
                > {{alertMessage}} </v-alert>
              </v-col>
            </v-card>
          </v-dialog>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Axios from "axios";
import { url } from "../assets/config";
import md5 from "md5";

export default {
  layout: "login",
  data: () => ({
    validLogin: true,
    validRegister: true,
    show1: false,
    show2: false,
    registerDialog: false,
    alert: false,
    alertType: "success",
    alertMessage: "",
    email: "",
    password: "",
    name: "",
    lastname: "",
    newEmail: "",
    newPassword: "",
    type_id: "",
    id: "",
    phone: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    passwordRules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 6 || "Min 6 characters",
    },
    rules: {
      required: (value) => !!value || "Required.",
    },
    phoneRules: [
      (v) => !!v || "Phone number is required",
      (v) => /^\d+$/.test(v) || "Must contain only numbers",
    ],
  }),
  methods: {
    login() {
      if (!this.$refs.login.validate()) return;
      Axios.get(`${url}/login`, {
        headers: { email: this.email, password: md5(this.password) },
      })
        .then((res) => {
          document.cookie = `token=${res.data.token}`
          this.$router.push({path: '/'})
        })
        .catch((err) => {
          alert(err.response.data.message)
          console.log(err.response)
        });
    },

    register() {
      if (!this.$refs.register.validate()) return;
      let newUser = {
        type_id: this.type_id,
        id: this.id,
        name: this.name,
        lastname: this.lastname,
        email: this.newEmail,
        role: "Usuario",
        phone: this.phone,
        password: md5(this.newPassword),
      }
      this.alert = true
      Axios.post(`${url}/login/register`, newUser)
      .then((res) => {
        if (res.data.ok) {         
          this.alertType = "success"
          this.alertMessage = res.data.message
        } else {
          this.alertType = "error"
          this.alertMessage = res.data.message
        }
      }).catch((err) => {
        this.alertType = "error"
        this.alertMessage = err.response.data.message
      })
      this.clearInputs()
    },

    clearInputs() {
      this.email = ""
      this.password = ""
      this.name = ""
      this.lastname = ""
      this.newEmail = ""
      this.newPassword = ""
      this.type_id = ""
      this.id = ""
      this.phone = ""
    }
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@700&family=Roboto&display=swap");

h2 {
  font-family: "Lato", sans-serif;
  font-size: 3rem;
}
</style>