/* eslint-disable no-undef */
import React, { useState, useEffect, useMemo, useCallback } from 'react';

const clearStorage = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        // 清除 localStorage、sessionStorage、cookie
        localStorage.clear();
        sessionStorage.clear();

        // 清除 cookie
        document.cookie.split(";").forEach(function (c) {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/"
            );
        });
        // 清除indexDB
        if (window.indexedDB && indexedDB.databases) {
          indexedDB.databases().then((dbs) => {
            dbs.forEach((dbInfo) => {
              indexedDB.deleteDatabase(dbInfo.name);
            });
          });
        }
        // 强制刷新
        location.reload(true);
      },
    });
  });
};

const Popup = () => {
  return (
    <div>
      <button onClick={clearStorage}>
        清除本地存储
      </button>
    </div>
  );
};

export default Popup;
