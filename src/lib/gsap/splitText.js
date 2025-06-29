// lib/gsap/SplitText.js
export default function SplitText(element, vars) {
  const words = element.textContent.trim().split(/\s+/)
  element.innerHTML = words
    .map((word) => `<span class="${vars.wordClass || 'word'}">${word}</span>`)
    .join(' ')
  const result = {
    words: Array.from(element.querySelectorAll(`.${vars.wordClass || 'word'}`)),
  }
  return result
}
