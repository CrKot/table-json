<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useTableStore } from '@/stores/table'
  import Search from '@/components/ui/Search.vue'
  import Pagination from '@/components/ui/Pagination.vue'
  import Table from '@/components/Table.vue'

  const route = useRoute()

  const tableStore = useTableStore()

  const tableViewRef = ref<HTMLDivElement>()

  const changeSearchHandler = async (value: string) => {
    route.query.filter = value
    onUpdate()
  }

  const onUpdate = async (scrollTop = false) => {
    await tableStore.requestTableData()
    if (!scrollTop || !tableViewRef.value) return

    tableViewRef.value.scrollIntoView({ behavior: 'smooth' })
  }

  onMounted(async () => {
    tableStore.queryParams = route.query
    await tableStore.requestTableData()
  })
</script>

<template>
  <section
    ref="tableViewRef"
    class="table-view"
  >
    <Search
      :model-value="tableStore.pageInfo.filter"
      @update:model-value="changeSearchHandler"
      placeholder="Введите значение"
    />
    <Table
      :data="tableStore.getTableData"
      @on-update="onUpdate"
    />
    <Pagination
      v-if="tableStore.pageInfo.totalPage > 1"
      :page="tableStore.pageInfo.page"
      :total="tableStore.pageInfo.totalPage"
      @on-update="() => onUpdate(true)"
    />
  </section>
</template>

<style lang="scss" scoped>
  .table-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 48px 0;
    width: 100%;
    height: 100%;
  }
</style>
