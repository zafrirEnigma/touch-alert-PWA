/* if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('Service worker registered:', registration);
      })
      .catch(error => {
        console.error('Service worker registration failed:', error);
      });
  });
}
 */
const macrodroidWebhook = window.prompt('Please enter the alert webhook URL:');
const makeWebhook = window.prompt('Please enter the image webhook URL:');

function debounce(func, delay) {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
}

const debouncedFunc = debounce(async () => {
  await fetch(macrodroidWebhook, { mode: 'no-cors' });
}, 3000);

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

      // Convert the canvas to a Blob object
      canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append('file', blob, 'thiefPhoto.png');

        // Create an anchor tag to download the image
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'thiefPhoto.png';

        fetch(makeWebhook, {
          method: 'POST',
          body: formData,
        })
          .then(response => {
            console.log('Success:', response);
            // Trigger the download of the image after the response is received
            downloadLink.click();
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }, 'image/png');
    }, 300000);
  })
  .catch(error => console.error(`Error accessing camera: ${error}`));
