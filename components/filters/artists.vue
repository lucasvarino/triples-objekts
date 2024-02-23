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

const artistsUrl = useRuntimeConfig().public.ARTISTS_URL;
const artists = ref<Artists[]>([]);
const selectedArtist = ref<Artists>();

const fetchArtists = async (): Promise<Artists[] | null> => {
  const { data, error } = await useFetch<Artists[]>(artistsUrl + "/artist/v1/");

  if (error.value) {
    console.error(error.value);
    return [];
  }

  return data.value;
};

const computedArtists = computed(() => {
  return artists.value.map((artist) => {
    return {
      name: artist.name,
      image: artist.logoImageUrl,
    };
  });
});

onMounted(async () => {
  const data = await fetchArtists();
  artists.value = data ?? [];

  console.log(artists.value);
});
</script>

<template>
  <h1>Artists</h1>
  <UContainer>
    <USelectMenu
      v-model="selectedArtist"
      :options="computedArtists"
      label="Artists"
    >
      <template #leading>
        <UAvatar
          :src="selectedArtist?.logoImageUrl"
          :alt="selectedArtist?.name"
          size="sm"
        />
      </template>
    </USelectMenu>
  </UContainer>
</template>
