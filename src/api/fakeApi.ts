import type { queryParamsType } from '@/types/api'
import type { IPeople, IPeopleResponse } from '@/types/people'

export const fakeApi = async (path: string, query: queryParamsType) => {
  const carrentFilter = sessionStorage.getItem('filter') || ''
  const response = await fetch(path)
  const { results } = await response.json()

  let currentPage = query.page ? +query.page : 1

  const data: IPeople[] = results.reduce((acc: IPeople[], item: IPeopleResponse) => {
    let validItem = true

    const peopleItem: IPeople = {
      id: item.id.value,
      picture: item.picture.medium,
      name: `${item.name.title} ${item.name.first} ${item.name.last}`,
      gender: item.gender,
      country: item.location.country,
      dob: item.dob.date,
      email: item.email,
      phone: item.phone
    }

    if (query.filter) {
      if (query.filter !== carrentFilter) {
        currentPage = 1
        sessionStorage.setItem('filter', query.filter)
      }
      const itemValues = Object.values(peopleItem)
      validItem = itemValues.some((value) =>
        String(value).toLowerCase().includes(query.filter!.toLowerCase())
      )
    }

    return validItem ? [...acc, peopleItem] : acc
  }, [])

  if (!data.length) {
    return {
      info: {
        page: 1,
        totalPage: 1,
        filter: query.filter || '',
        sorted: query.sorted || ''
      },
      data: []
    }
  }

  const totalPage = Math.ceil(data.length / 20)
  const currentIndex = 20 * (currentPage - 1)

  const listInpage = data.slice(currentIndex, currentIndex + 20)

  const sortedList = (): IPeople[] => {
    if (!query.sorted) {
      return listInpage
    }

    const keys = Object.keys(listInpage[0])

    if (!keys.some((key) => key === query.sorted)) return listInpage

    return listInpage.sort((a, b) => {
      const x = String(a[query.sorted!]).toLowerCase()
      const y = String(b[query.sorted!]).toLowerCase()
      return x < y ? -1 : x > y ? 1 : 0
    })
  }
  const apiData = {
    info: {
      page: currentPage,
      totalPage,
      filter: query.filter || '',
      sorted: query.sorted || ''
    },
    data: sortedList()
  }
  return Promise.resolve(apiData)
}
