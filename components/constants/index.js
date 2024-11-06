export function debounce(func, delay) {
    let timeout=null
    return (...args) => {
        if(timeout) clearTimeout(timeout)

        timeout=setTimeout(() => {
            func(...args)
            timeout=null
        }, delay)
    }
}

export function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }