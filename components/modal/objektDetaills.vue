<script setup lang="ts">
const props = defineProps({
  objekt: Object as PropType<Objekt>,
});

onMounted(() => {
  console.log(props.objekt);
});
</script>

<template>
  <div class="grid grid-cols-4 h-[91vh]">
    <div class="bg-black col-span-2 flex items-center justify-center ">
      <img :src="objekt.front" class="w-[340px] h-[510px]" />
    </div>
    <div class="col-span-2" :style="{ backgroundColor: props.objekt.backgroundColor }">
      <div class="w-96">
      Test
      </div>
    </div>
  </div>
</template>
