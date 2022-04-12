export const debounseFrame = (callback) => {
  let nextFrameCallback = 0;

  const nextExecution = () => {
    cancelAnimationFrame(nextFrameCallback);
    nextFrameCallback = requestAnimationFrame(callback);
  };
  return nextExecution;
};
