import React, { useEffect, useState } from "react";
import browser from "webextension-polyfill";

function useStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    browser.storage.sync.get(key).then((storage) => {
      if (storage) {
        setStoredValue(storage[key]);
      }
    });
  }, []);

  const setValue = (value: T) => {
    setStoredValue(value);
    browser.storage.sync.set({ [key]: value });
  };
  return [storedValue, setValue];
}

export function App() {
  const [width, setWidth] = useStorage("width", 480);
  const [height, setHeight] = useStorage("height", 270);
  const handleSubmit = () => {
    browser.tabs.reload();
  };
  return (
    <form>
      <input
        value={width}
        onChange={(e) => setWidth(parseInt(e.target.value))}
      />
      <input
        value={height}
        onChange={(e) => setHeight(parseInt(e.target.value))}
      />
      <button type="button" onClick={handleSubmit}>
        リロードして設定を反映
      </button>
    </form>
  );
}
