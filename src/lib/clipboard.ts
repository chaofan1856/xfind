export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const input = document.createElement('textarea')
      input.value = text
      input.setAttribute('readonly', '')
      input.style.position = 'fixed'
      input.style.left = '-9999px'
      document.body.append(input)
      input.select()
      const ok = document.execCommand('copy')
      input.remove()
      return ok
    } catch {
      return false
    }
  }
}
