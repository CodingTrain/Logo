if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', {scope: '/'}).then((registration) => {
      // Registration was successful
      console.log(`ServiceWorker registration successful with scope: ${registration.scope}`);
    }, (error) => {
      // registration failed :(
      console.log(`ServiceWorker registration failed: ${error}`);
    });
  });
}