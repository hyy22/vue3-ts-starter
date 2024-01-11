<script setup lang="ts">
import { type ThemeConfig } from '@/config/theme';
import { useThemeStore } from '@/store/theme';
import { camel2Line } from '@/utils/string';
import { computed, ref } from 'vue';
import useRect from '@/hooks/useRect';

/**
 * 主题配置
 */
const themeStore = useThemeStore();
// 选取配置项
const themeOption: Partial<keyof ThemeConfig>[] = [
  'primaryColor',
  'reverseColor',
  'bgColor',
  'textColor',
  'baseTextColor',
  'secondaryTextColor',
  'extraTextColor',
];
const themeVars = computed(() => {
  const themeConfig = themeStore.themeConfig;
  return themeOption.reduce((prev, cur) => {
    const key = `--theme-${camel2Line(cur)}`;
    prev[key] = themeConfig[cur];
    return prev;
  }, {} as any);
});
/**
 * 计算底部高度
 */
const footerRef = ref<HTMLDivElement>();
const footerRect = useRect(footerRef);
</script>

<template>
  <van-config-provider
    :theme-vars="{
      primaryColor: themeStore.themeConfig.primaryColor,
    }"
    theme-vars-scope="global">
    <div
      class="relative min-h-screen"
      :style="{ ...themeVars, background: 'var(--theme-bg-color)' }">
      <!-- 头部 -->
      <div v-if="$slots.header" class="sticky top-0 left-0 w-full">
        <slot name="header"></slot>
      </div>
      <slot></slot>
      <!-- 底部 -->
      <template v-if="$slots.footer">
        <!-- 占位 -->
        <div :style="{ height: footerRect?.height + 'px' }"></div>
        <div ref="footerRef" class="fixed w-full bottom-0 left-0">
          <slot name="footer"></slot>
        </div>
      </template>
    </div>
  </van-config-provider>
</template>
