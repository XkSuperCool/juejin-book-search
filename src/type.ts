export interface Catalogue {
	section_id: string
	title: string
}

export interface Section {
	content: string
	title: string
	markdown_show: string
	section_id: string
	index: number
	booklet_id: string
}

export type SectionResult = Section & {
	fragment: string
	children: {
		index: number
		fragment: string
	}[]
}

