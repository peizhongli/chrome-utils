/* eslint-disable no-undef */
console.log("Background script loaded");

// 监听消息
// onMessage 的回调不要用 async，否则消息通道会提前关闭。
// 用普通函数，内部用 IIFE 处理异步，或者用Promise，但都要确保 return true 保持消息通道开放。
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SHOW_NOTIFICATION") {
    chrome.notifications.create(Math.random().toString(), {
      type: "basic",
      iconUrl: "icons/logo.png",
      title: message.payload?.title,
      message: message.payload?.message,
      priority: 0,
    });
  }
});

// 初始化右键
const initContext = () => {
  chrome.contextMenus.create({
    id: "hard-refresh",
    title: "清空缓存并硬刷新",
    contexts: ["all"],
    documentUrlPatterns: ["*://*/*"],
  });
};

chrome.runtime.onInstalled.addListener(() => {
  initContext();
});

chrome.runtime.onStartup.addListener(() => {
  initContext();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "hard-refresh" && tab && tab.id) {
    chrome.tabs.reload(tab.id, { bypassCache: true });
  }
});
