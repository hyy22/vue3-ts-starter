<script setup lang="ts">
import { useRouter } from 'vue-router';
import { usePermissionStore } from '@/store/permission';

const router = useRouter();
const permissionStore = usePermissionStore();
const firstRoute = permissionStore.getFirstRoute();
router.replace(firstRoute!);
</script>

<template>
  <div v-loading="true" class="fullpage-loading"></div>
</template>

<style scoped>
.fullpage-loading {
  position: fixed;
  inset: 0;
}
</style>
