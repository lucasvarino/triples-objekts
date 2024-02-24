<script setup lang="ts">
import { ref } from "vue";

interface Member {
  id: string;
  name: string;
  alias: string;
  artist: string; // Group or solo
  order: number;
  profileImageUrl: string;
  units: string[];
}

interface Artists {
  contracts: string[];
  fandomName: string;
  logoImageUrl: string;
  members: Member[];
  name: string;
  title: string;
}

interface ArtistsResponse {
  artists: Artists[];
}

const artistsUrl = useRuntimeConfig().public.ARTISTS_URL;
const artists = ref<Artists[]>([]);
const selectedArtist = ref<Artists>();

const fetchArtists = async (): Promise<ArtistsResponse | null> => {
  const { data, error } = await useFetch<ArtistsResponse>(
    artistsUrl + "/artist/v1/"
  );

  if (error.value) {
    console.error(error.value);
    return null;
  }

  return data.value;
};

// Fetch the artists
const data = await fetchArtists();
if (data) {
  artists.value = data.artists;
}
</script>

<template>
  <h1>Artists</h1>
  <UContainer class="mb-12">
    <USelectMenu
      v-model="selectedArtist"
      :options="artists"
      label="Artists"
      class="w-72"
      size="lg"
    >
      <template #leading class="">
        <div
          v-if="selectedArtist"
          class="flex justify-center items-center h-12"
        >
          <UAvatar
            v-if="selectedArtist"
            :src="selectedArtist?.logoImageUrl"
            :alt="selectedArtist?.name"
            size="sm"
            v-bind="selectedArtist"
          />
          <label class="ml-4" v-bind="selectedArtist">{{
            selectedArtist.name
          }}</label>
        </div>
        <div v-else>
          <label>Filter by Group</label>
        </div>
      </template>
      <template #option="{ option: artist }">
        <UAvatar
          :src="artist.logoImageUrl"
          :alt="artist.name"
          size="sm"
          v-bind="artist"
        />
        <label v-bind="artist">{{ artist.name }}</label>
      </template>
    </USelectMenu>
  </UContainer>
</template>
