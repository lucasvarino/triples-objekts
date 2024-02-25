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

interface Group {
  name: string;
  image: string;
}

const artistsUrl = useRuntimeConfig().public.ARTISTS_URL;
const artists = ref<Artists[]>([]);
const selectedArtist = ref<Artists>();
const selectedMembers = ref<Member[]>();
const emit = defineEmits(["change-member", "change-group", "clear-filter"]);

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

const selectGroup = (artist: Artists) => {
  selectedMembers.value = artist.members;
  emit("change-group", artist);
};

const clearFilter = () => {
  selectedArtist.value = undefined;
  emit("clear-filter");
};

const group = computed(() => {
  return {
    name: selectedArtist.value?.name,
    image: selectedArtist.value?.logoImageUrl,
  };
});
// Fetch the artists
const data = await fetchArtists();
if (data) {
  artists.value = data.artists;
}
</script>

<template>
  <h1>Artists</h1>
  <UContainer class="mb-12">
    <UButton @click="clearFilter" class="mb-2"> Clear Filter </UButton>
    <USelectMenu
      v-model="selectedArtist"
      :options="artists"
      label="Artists"
      class="w-72"
      size="lg"
      @change="selectGroup"
      v-if="!selectedArtist"
    >
      <template #leading class="">
        <div
          v-if="selectedArtist"
          class="flex justify-center items-center h-12"
        >
          <UAvatar
            v-if="selectedArtist"
            :src="(selectedArtist as Artists).logoImageUrl"
            :alt="(selectedArtist as Artists).name"
            size="sm"
            v-bind="(selectedArtist as Artists)"
          />
          <label class="ml-4" v-bind="(selectedArtist as Artists)">{{
            (selectedArtist as Artists).name
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
    <FiltersMembers
      :group="group"
      :members="selectedMembers"
      v-else
      v-if="selectedMembers"
      @change-member="emit('change-member', $event)"
    />
  </UContainer>
</template>
