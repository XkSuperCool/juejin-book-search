import { ref } from 'vue'
import { request } from '../request'
import type { Section, Catalogue } from '../type'

function getCatalogues(booklet_id: string) {
  return request(
    '/booklet_api/v1/booklet/get?aid=2608&uuid=7137876915264898573&spider=0',
    {
      method: 'POST',
      body: JSON.stringify({ booklet_id })
    }
  ).then(res => {
    const { sections } = res.data
    return sections
  })
}

function getContent(section_id: string) {
  return request(
    '/booklet_api/v1/section/get?aid=2608&uuid=7137876915264898573&spider=0',
    {
      method: 'POST',
      body: JSON.stringify({ section_id })
    }
  ).then(res => {
    const { section } = res.data
    return section
  })
}

export function useSection() {
  const sections = ref<Section[]>([])
  async function load() {
    const matched = location.href.match(/\/(?:book|video)\/(\d+)\/section/)
    if (!matched) return

    const booklet_id = matched[1]
    const catalogues = (await getCatalogues(booklet_id)) as Catalogue[]
    const result = (
      await Promise.all(
        catalogues.map(catalogue => {
          return getContent(catalogue.section_id)
        })
      )
    ).map((section, index) => {
      return Object.assign(section, { index })
    }) as Section[]
    sections.value = result
  }

  // window.addEventListener('', () => {
  //   const matched = location.href.match(/\/(?:book|video)\/(\d+)\/section/)
  //   if (!matched) {
  //     sections.value = []
  //     return
  //   }
  //   const booklet_id = matched[1]
  //   if (booklet_id === sections.value[0].booklet_id) {
  //     return
  //   }
  //   load(booklet_id)
  // })

  return {
    load,
    sections
  }
}
