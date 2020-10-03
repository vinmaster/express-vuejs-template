<template>
  <q-page class="full-height column justify-start">
    <!-- <div class="q-gutter-y-md full-height" style="max-width: 100%;"> -->
    <q-card class="full-height column" style="flex: 1; padding-bottom: 56px;">
      <q-tab-panels v-model="tab" animated class="full-height" style="flex: 1;">
        <q-tab-panel name="feed" class="full-height">
          <div class="text-h3 text-center">Feed</div>
          <!-- <q-scroll-area class="" style="height: calc(100vh - 100px);">
            <div v-for="n in 100" :key="n" class="q-py-xs">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </div>
          </q-scroll-area> -->
          <q-card class="my-card">
            <q-card-section>
              <div class="text-h6 q-mb-xs">Post Title!</div>
              <div class="row no-wrap items-center">
                <q-rating size="18px" v-model="rating" icon-half="star_half" :max="5" color="primary" />
                <span class="text-caption text-grey q-ml-sm">4.2 (551)</span>
              </div>
            </q-card-section>
            <q-card-section horizontal>
              <img src="https://via.placeholder.com/100x100" />
              <q-card-section>
                This is a post on the feed. It is additional text that you can add to the post that is not the title before viewing this post
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="groups">
          <div class="text-h6">Groups</div>
          <q-card class="my-card">
            <q-img src="https://via.placeholder.com/300x150" basic>
              <div class="absolute-bottom text-h6">
                Group Name
              </div>
            </q-img>

            <q-card-section>
              This is a test group. Come join today!
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="services">
          <div class="text-h6">Services</div>
          Provide your services here
          <q-card dark bordered class="bg-grey-9 my-card">
            <q-card-section>
              <div class="text-h6">Test Service</div>
              <div class="text-subtitle2">$50/hr</div>
            </q-card-section>

            <q-separator dark inset />

            <q-card-actions>
              <q-btn flat>View</q-btn>
            </q-card-actions>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="settings">
          <div class="text-h6">Settings</div>
          Your settings here
        </q-tab-panel>
      </q-tab-panels>

      <q-separator />

      <q-page-sticky expand position="bottom">
        <q-tabs
          v-model="tab"
          dense
          class="bg-grey-3 full-width"
          align="justify"
          position="bottom"
          narrow-indicator
        >
          <q-tab name="feed" label="Feed" icon="list_alt" />
          <q-tab name="groups" label="Groups" icon="groups" />
          <q-tab name="services" label="Services" icon="design_services" />
          <q-tab name="settings" label="Settings" icon="settings" />
        </q-tabs>
      </q-page-sticky>
    </q-card>
    <!-- </div> -->
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Home',
  methods: {
    onIntersection(entry) {
      const index = parseInt(entry.target.dataset.id, 10);
      setTimeout(() => {
        this.inView.splice(index, 1, entry.isIntersecting);
      }, 50);
    },
  },
  data() {
    return {
      tab: 'feed',
      rating: 4.2,
      // eslint-disable-next-line no-unused-vars
      inView: Array.apply(null, Array(50)).map(_ => false),
    };
  },
});
</script>
