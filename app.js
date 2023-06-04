// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}

// Create the debounce function
function debounce(func, delay) {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
}

// Create the debounced function
const debouncedFunc = debounce(() => {
  // Make the HTTP call
  fetch('https://hook.eu1.make.com/vgdepiq9havn3re9cfo6p55vdk1xg4qx', {
    mode: 'no-cors',
  })
    .then(response => response.text())
    .then(data => console.log(data));
}, 500);

// Add the event listener
document.addEventListener('mousemove', debouncedFunc);

async function takePictureEveryFewMinutes(intervalInSeconds) {
  const videoElement = document.querySelector('video');
  const canvasElement = document.querySelector('canvas');
  const context = canvasElement.getContext('2d');

  // Request permission to access the camera
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoElement.srcObject = stream;

  // Take a picture every few minutes
  setInterval(() => {
    context.drawImage(
      videoElement,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    const imageData = canvasElement.toDataURL('image/png');
    // Do something with the image data
    console.log('Taking a picture...');
    console.log(imageData);
  }, intervalInSeconds * 1000);
}

takePictureEveryFewMinutes(5); // Take a picture every 5 minutes
