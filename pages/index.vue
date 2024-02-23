<script setup lang="ts">
interface ObjektResponse {
  edges: {
    node: Objekt;
  }[];
  totalCount: number;
}

interface Objekt {
  artists: string;
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

import { onMounted, ref } from "vue";

const url = "https://squid.subsquid.io/cosmo/graphql";

const collections = ref<Objekt[]>([]);
const page = ref(1);
const items = ref(0);

const fetchObjekts = async (page: number) => {
  const skips = (page - 1) * 30;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          collectionsConnection(orderBy: timestamp_DESC, first: 30,${
            skips === 0 ? "" : 'after: "' + skips + '",'
          } where: {}) {
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

const changePage = async (page: number) => {
  const { objekts } = (await fetchObjekts(page)) as ObjektResponse;
  collections.value = objekts;
};

onMounted(async () => {
  const { count, objekts } = (await fetchObjekts(page.value)) as ObjektResponse;
  items.value = count;
  collections.value = objekts;
});
</script>

<template>
  <template>
    <UContainer class="flex flex-wrap">
      <UContainer
        v-for="collection in collections"
        :key="collection.id"
        class="h-24 w-24 mr-4 mb-4"
      >
        <img :src="collection.front" />
      </UContainer>
      <UPagination
        v-model="page"
        :page-count="5"
        :total="items"
        class="mt-20 w-full"
        @update:model-value="changePage"
      />
    </UContainer>
  </template>
</template>
