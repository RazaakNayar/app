<template>
  <div class="settings-roles">
    <v-header :breadcrumb="breadcrumb">
      <template slot="buttons">
        <v-header-button
          icon="add"
          key="add"
          color="action"
          :label="$t('new')"
          @click="addNew = true;"
        />
      </template>
    </v-header>
    <v-table
      :items="items"
      :columns="fields"
      primary-key-field="collection"
      link="__link__"
    />

    <portal to="modal" v-if="addNew">
      <v-prompt
        v-model="newName"
        :confirm-text="$t('create')"
        :message="$t('create_role')"
        :placeholder="$t('enter_role_name')"
        :loading="adding"
        @cancel="addNew = false;"
        @confirm="add"
      />
    </portal>
  </div>
</template>

<script>
import api from "../../api";

export default {
  name: "settings-roles",
  metaInfo() {
    return {
      title: `${this.$t("settings")} | ${this.$t("roles")}`
    };
  },
  data() {
    return {
      error: null,
      roles: [],
      adding: false,
      addNew: false,
      newName: ""
    };
  },
  computed: {
    breadcrumb() {
      return [
        {
          name: this.$t("settings"),
          path: "/settings",
          color: "warning"
        },
        {
          name: this.$t("roles"),
          path: "/settings/roles"
        }
      ];
    },
    items() {
      return this.roles.map(role => ({
        ...role,
        __link__: `/settings/roles/${role.id}`
      }));
    },
    fields() {
      return [
        {
          field: "name",
          name: this.$t("name")
        },
        {
          field: "description",
          name: this.$t("description")
        }
      ];
    }
  },
  beforeRouteEnter(to, from, next) {
    api
      .getRoles()
      .then(res => res.data)
      .then(roles => {
        next(vm => {
          vm.$data.roles = roles;
        });
      })
      .catch(error => {
        this.$events.emit("error", {
          notify: this.$t("something_went_wrong_body"),
          error
        });
        next(vm => {
          vm.$data.error = error;
        });
      });
  },
  methods: {
    add() {
      this.adding = true;

      const id = this.$helpers.shortid.generate();
      this.$store.dispatch("loadingStart", { id });

      this.$api
        .createRole({
          name: this.newName
        })
        .then(res => res.data)
        .then(role => {
          this.$store.dispatch("loadingFinished", id);
          this.$router.push(`/settings/roles/${role.id}`);
        })
        .catch(error => {
          this.$store.dispatch("loadingFinished", id);
          this.$events.emit("error", {
            notify: this.$t("something_went_wrong_body"),
            error
          });
        });
    }
  }
};
</script>
