if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
const makeWebhook = window.prompt('Please enter the image webhook URL:');
const macrodroidWebhook = window.prompt('Please enter the alert webhook URL:');

function debounce(func, delay) {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
}

const debouncedFunc = debounce(() => {
  fetch(macrodroidWebhook, { mode: 'no-cors' });
}, 1000);

document.addEventListener('mousemove', debouncedFunc);

navigator.mediaDevices
  .getUserMedia({ video: true, audio: false })
  .then(stream => {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.setAttribute('playsinline', true);
    video.play();

    setInterval(() => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext('2d')
        .drawImage(video, 0, 0, canvas.width, canvas.height);

      const formData = new FormData();
      formData.append('file', canvas.toDataURL('image/jpeg'));
      formData.append('name', 'Make');

      fetch(makeWebhook, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        },
      });
    }, 6000);
  })
  .catch(error => console.error(`Error accessing camera: ${error}`));
