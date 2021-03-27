<template>
  <v-row justify="center" align="center">
    <v-col cols="10">
      <v-data-table :headers="headers" :items="users" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>You are a: {{role}}. 
              <p v-if="role == 'Admin'"> You have permission to delete and edit users. </p>
              <p v-else> You are only allowed to view the users</p>
            
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="headline">Edit User</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Legal first name*"
                          :rules="[rules.required]"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.lastname"
                          label="Legal last name*"
                          :rules="[rules.required]"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.email"
                          label="Email*"
                          prepend-inner-icon="mdi-email"
                          :rules="emailRules"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-select
                          v-model="editedItem.type_id"
                          :items="['CC', 'TI', 'other']"
                          label="Identification type*"
                          :rules="[rules.required]"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="editedItem.id"
                          label="Identification*"
                          prepend-inner-icon="mdi-card-account-details-outline"
                          :rules="[rules.required]"
                          required
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="editedItem.phone"
                          label="Phone number*"
                          :rules="phoneRules"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-select
                          v-model="editedItem.role"
                          :items="['Admin', 'User', 'Client']"
                          label="Role*"
                          :rules="[rules.required]"
                          required
                        ></v-select>
                      </v-col>
                    </v-row>
                    <small>*indicates required field</small>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline"
                  >Are you sure you want to delete this user?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }" v-if="role == 'Admin'">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Reset </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { url } from "../assets/config";
import Axios from "axios";
import jwt from "jsonwebtoken";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
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
    headers: [
      { text: "Name", value: "name", align: "start" },
      { text: "Lastname", value: "lastname" },
      { text: "Email", value: "email", sortable: false },
      { text: "Identification type", value: "type_id" },
      { text: "Identification", value: "id", sortable: false },
      { text: "Phone number", value: "phone" },
      { text: "Role", value: "role" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    users: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      lastname: "",
      email: "",
      type_id: "",
      id: "",
      phone: "",
      role: "",
    },
    defaultItem: {
      name: "",
      lastname: "",
      email: "",
      type_id: "",
      id: "",
      phone: "",
      role: "",
    },
    role: "User",
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      let secret_token = document.cookie.split("=")[1];
      this.role = jwt.decode(secret_token).role;

      this.getUsers();
    },

    getUsers() {
      let secret_token = document.cookie.split("=")[1];
      Axios.get(`${url}/users`, { headers: { token: secret_token } })
        .then((res) => {
          this.users = res.data.data;
        })
        .catch((err) => {
          if (err.response.status == 401) {
            document.cookie = "token=;";
            this.$router.push({ path: "/login" });
          }
          console.log(err.response);
        });
    },

    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      let secret_token = document.cookie.split("=")[1];
      Axios.delete(`${url}/users`, this.editedItem.email, {
        headers: { token: secret_token },
      })
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err.response.data.message);
          console.log(err.response);
        })
        .finally(() => {
          this.initialize();
        });
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        let secret_token = document.cookie.split("=")[1];
        Axios.put(`${url}/users`, this.editedItem, {
          headers: { token: secret_token },
        })
          .then((res) => {
            alert(res.data.message);
          })
          .catch((err) => {
            alert(err.response.data.message);
            console.log(err.response);
          })
          .finally(() => {
            this.initialize();
          });
      } else {
        this.users.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>
