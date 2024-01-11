<script setup lang="ts"></script>

<template>
  <AppLayout>
    <template #header>
      <AppNavBar :show-icon="false">
        <van-search background="var(--theme-primary-color)"></van-search>
      </AppNavBar>
    </template>
    <div style="height: 1999px">123445</div>
    <template #footer>
      <AppTabbar current="home"></AppTabbar>
    </template>
  </AppLayout>
</template>

<style scoped lang="scss"></style>
