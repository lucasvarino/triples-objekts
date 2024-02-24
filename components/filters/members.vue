<script setup lang="ts">
interface Member {
  id: string;
  name: string;
  alias: string;
  artist: string; // Group or solo
  order: number;
  profileImageUrl: string;
  units: string[];
}

interface Group {
  name: string | undefined;
  image: string | undefined;
}
const props = defineProps({
  members: {
    type: Array as PropType<Member[]>,
    required: true,
  },
  group: {
    type: Object as PropType<Group>,
    required: true,
  },
});

const members = ref<Member[]>(props.members);
const selectedMember = ref<Member>();
</script>

<template>
  <UContainer class="mb-12">
    <USelectMenu
      v-model="selectedMember"
      :options="members"
      label="Artists"
      class="w-72"
      size="lg"
    >
      <template #leading>
        <div
          v-if="selectedMember"
          class="flex justify-center items-center h-12"
        >
          <UAvatar
            v-if="selectedMember"
            :src="selectedMember.profileImageUrl"
            :alt="selectedMember.name"
            size="sm"
            v-bind="selectedMember"
          />
          <label class="ml-4" v-bind="selectedMember">{{
            selectedMember.name
          }}</label>
        </div>
        <div v-else class="flex justify-center items-center h-12">
          <UAvatar
            :src="group.image"
            :alt="group.name"
            size="sm"
            v-bind="group"
          />
          <label class="ml-4">{{ group.name }}</label>
        </div>
      </template>
      <template #option="{ option: member }">
        <UAvatar
          :src="member.profileImageUrl"
          :alt="member.name"
          size="sm"
          v-bind="member"
        />
        <label v-bind="member">{{ member.name }}</label>
      </template>
    </USelectMenu>
  </UContainer>
</template>
