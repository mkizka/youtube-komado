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
  const [width, setWidth] = useStorage("width", "480");
  const [height, setHeight] = useStorage("height", "270");
  return (
    <form>
      <p>
        <label>小窓プレーヤーの横幅</label>
        <br />
        <input value={width} onInput={(e) => setWidth(e.currentTarget.value)} />
      </p>
      <p>
        <label>小窓プレーヤーの縦幅</label>
        <br />
        <input
          value={height}
          onInput={(e) => setHeight(e.currentTarget.value)}
        />
      </p>
      <button type="button" onClick={() => browser.tabs.reload()}>
        リロードして設定を反映
      </button>
    </form>
  );
}
