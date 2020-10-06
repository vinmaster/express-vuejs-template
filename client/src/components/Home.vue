<template>
  <v-card>
    <v-tabs
      v-model="tab"
      background-color="green darken-4"
      centered
      dark
      icons-and-text
      grow
      class="rounded-0"
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-1">
        Feed
        <v-icon>view_headline</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        Groups
        <v-icon>groups</v-icon>
      </v-tab>

      <v-tab href="#tab-3">
        Services
        <v-icon>business_center</v-icon>
      </v-tab>

      <v-tab href="#tab-4">
        Profile
        <v-icon>account_circle</v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-1">
        <Feed></Feed>
      </v-tab-item>

      <v-tab-item value="tab-2">
        <Groups></Groups>
      </v-tab-item>

      <v-tab-item value="tab-3">
        <Services></Services>
      </v-tab-item>

      <v-tab-item value="tab-4">
        <Profile></Profile>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import Feed from './Feed';
import Groups from './Groups';
import Services from './Services';
import Profile from './Profile';

export default {
  name: 'Home',

  components: {
    Feed,
    Groups,
    Services,
    Profile,
  },

  data: () => ({
    tab: 0,
  }),
};
</script>

<style scoped></style>
