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
        Work Life
        <v-icon>business_center</v-icon>
      </v-tab>

      <v-tab href="#tab-4">
        Jobs
        <v-icon>account_circle</v-icon>
      </v-tab>

      <v-tab href="#tab-5">
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
        Job postings
      </v-tab-item>

      <v-tab-item value="tab-5">
        <Profile></Profile>
      </v-tab-item>
    </v-tabs-items>
    
    <!-- <v-bottom-navigation background-color="green darken-4" fixed grow>
      <v-btn flat color="green darken-4" @click="tab = t.id" v-for="t in tabs" :key="t.id">
        <span class="white--text">{{ t.text }}</span>
        <v-icon class="white--text">{{ t.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation> -->
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
    tabs: [
      {
        id: 'tab-1',
        text: 'Feed',
        icon: 'view_headline',
      },
      {
        id: 'tab-2',
        text: 'Groups',
        icon: 'groups',
      },
      {
        id: 'tab-3',
        text: 'Services',
        icon: 'business_center',
      },
      {
        id: 'tab-4',
        text: 'Profile',
        icon: 'account_circle',
      },
    ],
  }),
};
</script>

<style scoped></style>
