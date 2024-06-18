<script setup lang="tsx">
  import { ref, watchEffect } from 'vue'
  import { useRoute } from 'vue-router'
  import Button from '@/components/ui/Button.vue'
  import IconArrow from '@/components/icons/IconArrow.vue'

  interface Props {
    page: number,
    total: number
  }

  interface Emits {
    (e: 'onUpdate'): void
  }

  const props = defineProps<Props>()
  const emits = defineEmits<Emits>()

  const route = useRoute()

  const totalPages = ref<number[]>([])

  /**
   * Возвращает список предыдущих и следующих страниц
   */
  const getPageNumbers = () => {
    const pivot = +props.page

    const leftList: number[] = []
    const rightList: number[] = []

    for (let i = 0; i < props.total; i++) {
      if (totalPages.value[i] < pivot) {
        leftList.push(totalPages.value[i])
      }

      if (totalPages.value[i] > pivot) {
        rightList.push(totalPages.value[i])
      }
    }

    let round = 5
    let left = 2
    let right = 2

    while(round > 0) {
      if (leftList.length === 0 && rightList.length === 0) {
        return
      }

      round--

      if (leftList.length < left) {
        left--
        right++
      }

      if (rightList.length < right) {
        left++
        right--
      }
    }

    return [...leftList.slice(-left), pivot, ...rightList.slice(0, right)]
  }

  watchEffect(() => {
    totalPages.value = []

    for(let i = 1; i <= props.total; i++) {
      totalPages.value.push(i)
    }
  })

  const updateHandler = () => {
    requestAnimationFrame(() => {
      emits('onUpdate')
    })
  }
</script>

<template>
  <div class="pagination">
    <Button
      v-show="page > 1"
      button-class="pagination__prev"
      :href="{
        query: {
          ...route.query,
          page: page - 1
        }
      }"
      @on-click="updateHandler"
    >
      <template #icon>
        <IconArrow />
      </template>
    </Button>
    <ul class="pagination__ul">
      <li
        v-for="pageNumber in getPageNumbers()"
        class="pagination__li"
      >
        <Button
          :class="[
            'pagination__button',
            +pageNumber === +page ? '_active' : ''
          ]"
      :href="{
        query: {
          ...route.query,
          page: +pageNumber
        }
      }"
          @on-click="updateHandler"
        >
          {{ pageNumber }}
        </Button>
      </li>
    </ul>
    <Button
      v-show="page < total"
      button-class="pagination__next"
      :href="{
        query: {
          ...route.query,
          page: page + 1
        }
      }"
      @on-click="updateHandler"
    >
      <template #icon>
        <IconArrow />
      </template>
    </Button>
  </div>
</template>

<style lang="scss">
  .pagination {
    position: relative;

    &__ul {
      display: flex;
      gap: 2px;
    }

    &__li {
      width: 30px;
      place-content: center;
      place-items: center;
    }

    &__button {
      display: flex;
      place-content: center;
      background: var(--color-border);

      & > a {
        font-weight: bold;
        transition: opacity 0.3s ease;
      }

      @media (hover: hover) {
        & > a:hover {
          opacity: 0.5;
        }
      }

      &._active {
        background: var(--color-border-hover);
        cursor: default;
        pointer-events: none;
      }
    }

    &__prev,
    &__next {
      position: absolute;
      top: 2px;
    }

    &__prev {
      rotate: 90deg;
      left: -32px;
    }

    &__next {
      right: -32px;
      rotate: -90deg;
    }

    @media (hover: hover) {
      &__prev,
      &__next {
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.25);
        }
      }
    }
  }
</style>
