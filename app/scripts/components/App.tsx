import React, { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import "@exampledev/new.css";
import "./App.css";

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
  const [playerWidth, setPlayerWidth] = useStorage("playerWidth", 480);
  const playerWidthOptions = [320, 400, 480, 560, 640, 720, 800];
  return (
    <>
      <label>小窓プレーヤーの横幅</label>
      <select
        value={playerWidth}
        onChange={(e) => setPlayerWidth(parseInt(e.currentTarget.value))}
      >
        {playerWidthOptions.map((playerWidth) => (
          <option key={playerWidth} value={playerWidth}>
            {`${playerWidth}x${(playerWidth * 9) / 16}`}
          </option>
        ))}
      </select>
      <button type="button" onClick={() => browser.tabs.reload()}>
        リロードして設定を反映
      </button>
    </>
  );
}
