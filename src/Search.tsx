import { defineComponent, ref, createVNode } from 'vue'
import { useSearch } from './composables/useSearch'
import { useSection } from './composables/useSection'
import type { SectionResult } from './type'

export default defineComponent({
  setup() {
    const visible = ref(false)
    const { sections, load } = useSection()
    const { keyword, isEmpty, searchResult, skip } = useSearch(sections)

    function handleSkip(item: SectionResult, index?: number) {
      visible.value = false
      skip(item, index)
    }

    function highlight(fragment: string) {
      const content = fragment.replace(keyword.value, `<span style="color: #007fff;">${keyword.value}</span>`) + '...'
      return createVNode('span', {
        innerHTML: content
      })
    }

    const isBookPage = /\/(?:book|video)\/\d+\/section\/\d+/.test(location.href) 
    return () => (
      <>
        {
          isBookPage && <div
            pos="fixed right-[16.5%] bottom-[140px]"
            class='bg-[#007fff] w-[50px] h-[50px] text-white rounded-[50%] flex items-center justify-center cursor-pointer'
            onClick={() => {
              load()
              visible.value = !visible.value
            }}
          >
            <span class='i-tabler-search text-6'></span>
          </div>
        }
        <div
          pos='fixed top-1/6 left-1/2'
          box='border'
          border='rounded-xl'
          z='9999'
          class='w-[40vw] transform -translate-x-1/2 bg-[hsl(0,2%,92%,0.75)] backdrop-blur-sm shadow-lg'
          style={{display: visible.value ? 'block' : 'none'}}
        >
          <div box='border' class='flex items-center px-4 py-2'>
            <div class='i-tabler-search text-8 text-slate-700'></div>
            <input
              h='12'
              p='x-2'
              w='full'
              text='7 slate-700'
              bg='transparent'
              box='border'
              border='none'
              outline='none'
              placeholder='请输入关键字'
              onKeyup={(e: KeyboardEvent) =>
                e.code === 'Enter' &&
                (keyword.value = (e.target as HTMLInputElement).value)
              }
            />
          </div>
          <div w='full' h='1px' bg='zinc-300'></div>
          <div class='px-4 py-2 min-h-15 max-h-[60vh] overflow-auto'>
            {isEmpty.value && <div text='5 slate-500 center' class='mt-3'>没有搜索到内容...</div>}
            {searchResult.value.map(item => {
              return (
                <div
                  key={item.section_id}
                  class='leading-12 text-6 cursor-pointer mb-3'
                >
                  <div onClick={() => handleSkip(item)} class='text-slate-700'>
                    {item.title} ⎯ <span text='5 slate-500'>
                      {highlight(item.fragment)}
                    </span>
                  </div>
                  {item.children.map(child => {
                    return (
                      <div
												pl='10'
												text='5 slate-500'
												key={child.index}
												onClick={() => handleSkip(item, child.index + 1)}
											>
                        <span class='text-7'>⤿ </span>
                        {highlight(child.fragment)}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </>
    )
  }
})
