<script setup lang="tsx">
  import { useSlots } from 'vue'
  import { RouterLink } from 'vue-router'
  import type { hrefType } from '@/types/route'

  export type ButtonType = 'button' | 'reset' | 'submit'
  export type ButtonSize = 'xl' | 'l' | 'm'

  interface Props {
    href?: string | hrefType,
    disabled?: boolean,
    bordered?: boolean,
    size?: ButtonSize,
    type?: ButtonType,
    buttonClass?: string | string[],
    iconWrapperClass?: string | string[],
    title?: string,
    iconView?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'button',
    size: 'l',
    buttonClass: '',
    iconWrapperClass: '',
  })

  const emits = defineEmits<{
    (e: 'onClick'): void
  }>()

  const slots = useSlots()

  /**
   * Контент кнопки либо ссылки
   */
  const buttonContent = () => (
    <>
      { slots.icon && (
        <div class={[
          'buttonComponent__iconWrapper',
          props.iconWrapperClass
        ]}>
          { slots.icon() }
        </div>
      )}
      { slots.default?.() }
    </>
  )
</script>

<template>
  <div
    :title="title"
    :class="[
      'buttonComponent',
      bordered ? '_bordered' : '',
      size ? `_${size}` : ''
    ]"
  >
    <template v-if="href">
      <RouterLink
        :to="href"
        :class="[
          'buttonComponent__button',
          buttonClass
        ]"
        @click="() => emits('onClick')"
      >
        <buttonContent />
      </RouterLink>
    </template>
    <template v-else>
      <button
        :type="type"
        :class="[
          'buttonComponent__button',
          buttonClass
        ]"
        :disabled="disabled"
        @click="() => emits('onClick')"
      >
        <buttonContent />
      </button>
    </template>
  </div>
</template>

<style lang="scss">
  .buttonComponent {
    display: flex;

    &__button {
      cursor: pointer;
      background: transparent;
      border: none;
      padding: 0;
    }

    &__iconWrapper {
      width: 20px;
      height: 20px;

      & > svg {
        width: 100%;
        height: 100%;
      }
    }

    &._bordered {
      border: 1px solid orange;
    }
  }
</style>
