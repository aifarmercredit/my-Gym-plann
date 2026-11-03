/* POWER GYM timer service worker */
const NOTIF_TAG = "powergym-timer";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
self.addEventListener("notificationclick", (event) => {
  const action = event.action;
  event.notification.close();
  if (action === "pause" || action === "resume" || action === "stop") {
    event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      if (clients.length) { clients[0].focus(); clients[0].postMessage({ type: "timer-action", action }); }
      else self.clients.openWindow("./?timerAction=" + action);
    }));
    return;
  }
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
    if (clients.length) return clients[0].focus();
    return self.clients.openWindow("./");
  }));
});