<template>
  <v-hover>
    <template v-slot:default="{ hover }">
      <v-card
        :to="cardInfo.buttonRoute"
        class="mx-auto"
        :elevation="hover ? 24 : 6"
        max-width="344"
        outlined
        nuxt
      >
        <v-list-item three-line>
          <v-list-item-content>
            <div class="text-overline mb-4">
              {{ cardInfo.title.toUpperCase() }}
            </div>
            <v-list-item-title class="text-h5 mb-1">
              {{ cardInfo.innerTitle }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ cardInfo.innerText }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-avatar
            tile
            size="80"
          >
            <v-icon v-if="cardInfo.icon" size="50" color="primary">{{ cardInfo.icon }}</v-icon>
            <img v-if="!cardInfo.icon" :src="cardInfo.imageSource" alt="Image" class="" />
          </v-list-item-avatar>
        </v-list-item>

        <v-card-actions>
          <v-btn
            class="light-blue lighten-5"
            outlined
            rounded
            text
          >
            {{ cardInfo.buttonText }} &#8594;
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-hover>
</template>

<script>
export default {
  name: 'NavigationCard',
  props: {
    cardInfo: Object
  }
}
</script>