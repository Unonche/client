export function debounce(func: CallableFunction, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
