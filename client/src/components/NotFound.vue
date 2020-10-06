<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card height="400" color="transparent" flat>
          <div class="display-3 mt-5">Page not found.</div>
          <div class="grey--text lighten-5 mt-2">
            The page you are trying to get to never existed in this reality, or has migrated to a parallel universe.
          </div>
          <div class="paragraph-text mt-2">
            Try going back to home page
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'NotFound',

  data: () => ({}),
};
</script>
