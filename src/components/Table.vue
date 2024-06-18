<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import type { IPeople } from '@/types/people'
  import Button from '@/components/ui/Button.vue'
  import IconSort from '@/components/icons/IconSort.vue'

  enum localizePeopleKey {
    id = 'id',
    picture = 'Аватар',
    name = 'Имя',
    gender = 'Пол',
    country = 'Страна',
    dob = 'Дата рождения',
    email = 'Email',
    phone = 'Телефон'
  }

  interface Props {
    data: IPeople[]
  }

  interface Emits {
    (e: 'onUpdate'): void
  }

  const props = defineProps<Props>()
  const emits = defineEmits<Emits>()
  const route = useRoute()

  /**
   * Возвращает локализованные заголовки таблицы
   */
  const getTableLocalColumn = (key: keyof typeof localizePeopleKey) => {
    return localizePeopleKey[key] || key
  }

  const updateHandler = () => {
    requestAnimationFrame(() => {
      emits('onUpdate')
    })
  }
</script>

<template>
  <table v-if="props.data.length" class="table">
    <tr class="table__column">
      <th
        v-for="column in Object.keys(props.data[0])"
        class="table__cell _head"
      >
        <div class="table__headItem">
          <span>
            {{ getTableLocalColumn(column as keyof typeof localizePeopleKey) }}
          </span>
          <Button
            class="table__sorted"
            :href="{
              query: {
                ...route.query,
                sorted: column
              }
            }"
            @on-click="updateHandler"
          >
            <template #icon>
              <IconSort />
            </template>
          </Button>
        </div>
      </th>
    </tr>
    <tr
      v-for="item in props.data"
      class="table__row"
    >
      <td
        v-for="(value, key) in item"
        class="table__cell"
      >
        <img v-if="key === 'picture'" :src='value'>
        <span v-else>{{ value }}</span>
      </td>
    </tr>
  </table>
  <div v-else>
    пусто
  </div>
</template>

<style lang="scss" scoped>
  .table {
    border: 1px solid var(--color-border-hover);
    padding: 20px;
    border-collapse: collapse;

    &__column {
      border-bottom: 1px solid var(--color-border-hover);

      &:last-child {
        border-left: none;
      }
    }

    &__row {
      border-bottom: 1px solid var(--color-border);

      &:last-child {
        border: none;
      }
    }

    &__cell {
      padding: 4px 12px;
      border-right: 1px solid var(--color-border);

      &._head {
        padding: 12px;
      }

      &:last-child {
        border: none;
      }
    }

    &__headItem {
      display: flex;
      gap: 16px;
      justify-content: space-between;
      align-items: center;
    }

    &__sorted {
      display: inline-flex;
      margin-left: 16px;
    }

  }
</style>
