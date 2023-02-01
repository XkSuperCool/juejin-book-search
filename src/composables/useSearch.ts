import { ref, computed, nextTick } from 'vue'
import type { Ref } from 'vue'
import { Section, SectionResult } from '../type'

const SUB_STRING_NUMBER = 15

function getTextContent(html: string) {
	const el = document.createElement('div')
	el.innerHTML = html
	return el.textContent || ''
}

function normalizeText(text: string) {
	return text.replace(/^[，|,|.|。]/, '').replace(/[，|,|.|。]$/, '')
}

const SPAN_CLASS_NAME = 'juejin-book-search'
const SPAN_TAG = `<span class="${SPAN_CLASS_NAME}" style="background-color: #007fff; color: #fff;">`

export function useSearch(sections: Ref<Section[]>) {
  const keyword = ref('')
	const isEmpty = ref(false)
  const searchResult = computed<(SectionResult)[]>(() => {
    if (!keyword.value) {
			isEmpty.value = false
			return []
		}
		const result = sections.value
			.filter((section) => section.content.indexOf(keyword.value) > 0)
			.map((item) => {
				const section: SectionResult = item as SectionResult
				const textContent = getTextContent(section.content)
				const index = textContent.indexOf(keyword.value)
				section.fragment = normalizeText(textContent.substring(index - SUB_STRING_NUMBER, index + SUB_STRING_NUMBER))
				section.children = []
				const searchReg = new RegExp(keyword.value, 'g')
				let execResult: RegExpExecArray | null
				while ((execResult = searchReg.exec(textContent))) {
					if (execResult.index !== index) {
						const fragment = textContent.substring(execResult.index - SUB_STRING_NUMBER, execResult.index + SUB_STRING_NUMBER)
						section.children.push({
							fragment: normalizeText(fragment),
							index: section.children.length
						})
					}
				}
				return section
			})
		isEmpty.value = !result.length
		return result
  })

	function skip(section: SectionResult, keywordIndex = 0) {
		const sectionListDOM = document.getElementsByClassName('section-list')[0]
  	;(sectionListDOM.childNodes[section.index] as HTMLElement).click()
		setTimeout(() => {
			const contentBody = document.getElementsByClassName('markdown-body')[0]
			const replaceReg = new RegExp(`(?<!${SPAN_TAG})${keyword.value}`, 'g')
			const replaceValue = `${SPAN_TAG}${keyword.value}</span>`
			const html = contentBody.innerHTML.replaceAll(replaceReg, replaceValue)
			contentBody.innerHTML = html
			const top = contentBody.getElementsByClassName(SPAN_CLASS_NAME)[keywordIndex].getBoundingClientRect().top
			document.documentElement.scrollTop = document.documentElement.scrollTop + top - 200
		}, 700)
	}

  return {
    keyword,
		isEmpty,
		searchResult,
		skip
  }
}
