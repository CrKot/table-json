import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import type { queryParamsType } from '@/types/api'
import type { IPeople } from '@/types/people'
import { fakeApi } from '@/api/fakeApi'

export const useTableStore = defineStore('table', () => {
  const router = useRouter()
  const route = useRoute()

  const queryParams = ref<queryParamsType>({})
  const tableData = ref<IPeople[]>([])

  const pageInfo = ref({
    page: 1,
    totalPage: 1,
    filter: '',
    sorted: ''
  })

  const getTableData = computed(() => tableData.value)

  const setQueryParams = (newQuery: queryParamsType) => {
    queryParams.value = newQuery
  }

  const requestTableData = async () => {
    const { info, data } = await fakeApi('/api.json', route.query)
    tableData.value = data
    pageInfo.value = info

    const query: queryParamsType = {}

    if (pageInfo.value.totalPage > 1) {
      query.page = pageInfo.value?.page || 1
    }

    const keys = ['filter', 'sorted'] as (keyof queryParamsType)[]

    keys.forEach((key) => {
      if (!pageInfo.value[key]) return

      query[key] = pageInfo.value[key]
    })

    router.push({ query })
  }

  return {
    tableData,
    getTableData,
    queryParams,
    pageInfo,
    setQueryParams,
    requestTableData
  }
})
