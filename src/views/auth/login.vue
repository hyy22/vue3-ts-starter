<script setup lang="ts">
import { usePermissionStore } from '@/store/permission';
import { useUserStore } from '@/store/user';

const permissionStore = usePermissionStore();
const userStore = useUserStore();
userStore.setToken('123');
permissionStore.setPermission(['1']);
</script>

<template>
  <div>login page</div>
</template>
