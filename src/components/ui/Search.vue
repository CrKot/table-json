<script setup lang="ts">
  import {
    ref,
    onMounted,
    watchEffect
  } from 'vue'
  import Button from '@/components/ui/Button.vue'
  import IconClose from '@/components/icons/IconClose.vue'
  import IconSearch from '@/components/icons/IconSearch.vue'

  interface Emits {
    (e: 'update:modelValue', modelValue: string): void
  }

  const emits = defineEmits<Emits>()

  const props = withDefaults(defineProps<{
    modelValue?: string,
    placeholder?: string
  }>(), {
    modelValue: '',
    placeholder: 'Поиск'
  })

  const inputRef = ref()
  const inputValue = ref('')

  const onSubmit = () => {
    emits('update:modelValue', inputValue.value)
  }

  const resetFormHandler = () => {
    inputValue.value = ''
    inputRef.value?.focus()
    emits('update:modelValue', inputValue.value)
  }

  watchEffect(() => {
    inputValue.value = props.modelValue
  })

  onMounted(() => {
    inputValue.value = props.modelValue
  })

  const unVisitedHandler = () => {
    window.setTimeout(() => {
      if (props.modelValue !== inputValue.value) {
        inputValue.value = props.modelValue
      }
    }, 200)
  }
</script>

<template>
  <form
    class="form-search"
    @submit.prevent="onSubmit"
  >
    <h2>Поиск по столбцам таблицы</h2>
    <div class="form-search__wrapper">
      <input
        ref="inputRef"
        id="search-input"
        type="text"
        @blur="unVisitedHandler"
        class="form-search__input"
        :placeholder="placeholder"
        v-model="inputValue"
      />
      <div
        v-if="inputValue"
        class="form-search__buttonBlock"
      >
        <Button
          iconView
          type="reset"
          button-class="form-search__button"
          icon-wrapper-class="form-search__buttonIcon"
          @onClick="resetFormHandler"
        >
          <template #icon>
            <IconClose />
          </template>
        </Button>
        <Button
          iconView
          type="submit"
          button-class="form-search__button"
          icon-wrapper-class="form-search__buttonIcon"
        >
          <template #icon>
            <IconSearch />
          </template>
        </Button>
      </div>
    </div>
  </form>
</template>

<style lang="scss">
  .form-search {
    min-width: min(540px, 100%);

    &__wrapper {
      position: relative;
    }

    &__input {
      border: 1px solid var(--vt-c-divider-light-1);
      padding: 7px 92px 7px 16px;
      color: var(--color-text);
      background: var(--color-background);
      width: 100%;
      height: 100%;
    }

    &__buttonBlock {
      position: absolute;
      display: flex;
      right: 8px;
      top: 50%;
      gap: 16px;
      transform: translateY(-50%);
    }

    &__button {
      display: flex;
      transition: opacity 0.3s ease;
      color: var(--color-text);

      @media (hover: hover) {
        &:hover {
          opacity: 0.5;
        }
      }
    }

    &__buttonIcon {
      width: 16px;
      height: 16px;

      & > svg {
        width: 100%;
        height: 100%;
      }
    }

  }
</style>
