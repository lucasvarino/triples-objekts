<script setup lang="ts">
interface ObjektResponse {
  edges: {
    node: Objekt;
  }[];
  totalCount: number;
}

interface Objekt {
  artists: string[];
  back: string;
  backgroundColor: string;
  class: string;
  front: string;
  id: string;
  member: string;
  number: string;
  season: string;
  textColor: string;
  thumbnail: string;
  timestamp: string;
}

interface ObjektResponse {
  count: number;
  objekts: Objekt[];
}

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

import { onMounted, ref } from "vue";
import Artists from "~/components/filters/artists.vue";

const collections = ref<Objekt[]>([]);
const page = ref(1);
const items = ref(0);
const selectedGroup = ref<Artists>();
const selectedMember = ref<Member>();

const url = useRuntimeConfig().public.COSMO_URL;

const fetchObjekts = async (page: number) => {
  const skips = (page - 1) * 32;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          collectionsConnection(orderBy: timestamp_DESC, first: 32,${
            skips === 0 ? "" : 'after: "' + skips + '",'
          } where: {${
        selectedGroup.value
          ? 'artists_containsAll: "' + selectedGroup.value.name + '"'
          : ""
      }${
        selectedMember.value
          ? 'member_eq: "' + selectedMember.value.name + '"'
          : ""
      }}) {
            totalCount
            edges {
              node {
                artists
                back
                backgroundColor
                class
                front
                id
                member
                number
                season
                textColor
                thumbnail
                timestamp
              }
            }
          }
        }
      `,
    }),
  });

  if (!response.ok) {
    console.error("Failed to fetch objekts");
    return null;
  }

  const { data } = (await response.json()) as {
    data: { collectionsConnection: ObjektResponse };
  };

  return {
    count: data.collectionsConnection.totalCount,
    objekts: data.collectionsConnection.edges.map((edge) => edge.node),
  };
};

const changePage = async (page: number, filter = false) => {
  const { objekts } = (await fetchObjekts(page)) as ObjektResponse;

  if (filter) {
    collections.value = objekts;
    return;
  }

  collections.value = collections.value.concat(objekts);
};

const changeGroup = async (artist: Artists) => {
  selectedGroup.value = artist;
  changePage(1, true);
};

const changeMember = (member: Member) => {
  selectedMember.value = member;
  changePage(1, true);
};

const clearFilter = () => {
  selectedGroup.value = undefined;
  selectedMember.value = undefined;
  changePage(1, true);
};

onMounted(async () => {
  const { count, objekts } = (await fetchObjekts(page.value)) as ObjektResponse;
  items.value = count;
  collections.value = objekts;

  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      collections.value.length < items.value
    ) {
      page.value++;
      changePage(page.value);
    }
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", () => {});
});
</script>
<template>
  <Artists
    @change-member="changeMember"
    @change-group="changeGroup"
    @clear-filter="clearFilter"
  />
  <UContainer
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
  >
    <USkeleton
      v-if="!collections.length"
      v-for="i in 32"
      :key="i"
      class="w-[165px] h-[256px] animate-pulse"
    />
    <UContainer
      v-for="collection in collections"
      :key="collection.id"
      class="hover:scale-110 transition-all"
    >
      <NuxtImg
        :src="collection.front"
        class="w-full h-full object-cover"
        :alt="collection.member"
      />
    </UContainer>
  </UContainer>
</template>
