import { createApp } from 'vue'
import Search from './Search'
import 'uno.css'
const el = document.createElement('div')
el.id = 'juejin-book-search'
document.body.appendChild(el)

createApp(Search).mount(el)
