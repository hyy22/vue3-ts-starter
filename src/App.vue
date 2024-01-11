<script setup lang="ts"></script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade">
      <component :is="Component" :key="route.fullPath" />
    </transition>
  </router-view>
</template>
