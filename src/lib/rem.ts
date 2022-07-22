const rem = (value: number): number => {
  return value * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

export default rem;
