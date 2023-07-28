<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <el-dialog
    append-to-body
    draggable
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    v-bind="$attrs">
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>
