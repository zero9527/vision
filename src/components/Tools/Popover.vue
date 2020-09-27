<template>
  <div class="popover" ref="popoverRef">
    <span class="popover__content" ref="popover__content" @click="onAddClick">
      <slot />
    </span>
    <div 
      v-if="dialogVisible" 
      class="popover__dialog" 
      :class="absolute ? 'absolute' : 'fixed'"
      :style="`top: ${pos.top}; right: ${pos.right};`"
    >
      <slot name="popover" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';

export default defineComponent({
  name: 'popover',
  props: {
    absolute: {
      type: Boolean,
      default: true // false // 默认固定定位
    }
  },
  setup(props, ctx) {
    const popoverRef = ref<any>(null);
    const popover__content = ref<any>(null);
    const pos = reactive({ top: '100%', right: '0' });
    const dialogVisible = ref(false);

    onMounted(() => {
      if (!props.absolute) renderPopoverFixed(); 
    });

    // 固定定位
    const renderPopoverFixed = () => {
      const { offsetTop, offsetRight } = popoverRef.value!;
      console.log(offsetTop, offsetRight);
      pos.top = offsetTop;
      pos.right = offsetRight;
    };

    const onAddClick = () => {
      dialogVisible.value = !dialogVisible.value;
      console.log(popover__content.value.scrollIntoView)
      popover__content.value!.scrollIntoView({ inline: 'end' });
    }

    const closeDialog = () => {
      dialogVisible.value = false;
    }

    return {
      popoverRef,
      popover__content,
      pos,
      dialogVisible,
      onAddClick,
      closeDialog
    }
  }
});
</script>

<style lang="less" scoped>
.popover {
  position: relative;
  display: inline-block;

  &__dialog {
    width: max-content;
    top: calc(100% + 2px);
    right: 0;
    display: inline-block;
    padding: 8px;
    background: #fff;
    box-shadow: 1px 1px 10px rgba(0,0,0,0.2);
    z-index: 10;

    &.absolute {
      position: absolute;
    }

    &.fixed {
      position: fixed;
    }
  }
}
</style>
