if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const scope = 'logo-code-editor';
    navigator.serviceWorker.register(`sw.js`, {scope: scope}).then((registration) => {
      // Registration was successful
      console.log(`ServiceWorker registration successful with scope: ${registration.scope}`);
    }, (error) => {
      // registration failed :(
      console.log(`ServiceWorker registration failed: ${error}`);
    });
  });
}