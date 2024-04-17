<script setup lang="ts">
const props = defineProps({
  objekt: Object as PropType<Objekt>,
});
</script>

<template>
  <div class="grid grid-cols-4 h-[91vh]">
    <div class="bg-black col-span-3 flex items-center justify-center ">
      <img :src="objekt.front" class="w-[340px] h-[510px]" />
    </div>
    <div class="col-span-1">

    </div>
  </div>
</template>
