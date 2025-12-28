"use client";

import React, { useState } from "react";

type Operator = "+" | "-" | "*" | "/";

const operators: Operator[] = ["+", "-", "*", "/"];

const App = () => {
  const [input, setInput] = useState<string>("");

  const getLastChar = () => input.slice(-1);

  const isOperator = (char: string): char is Operator =>
    operators.includes(char as Operator);

  const clickVal = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.dataset.value;
    if (!value) return;

    const lastChar = getLastChar();

    if (isOperator(value) && (input === "" || isOperator(lastChar))) return;

    if (value === ".") {
      const lastNumber = input.split(/[\+\-\*\/]/).pop();
      if (lastNumber?.includes(".")) return;
    }

    setInput((prev) => prev + value);
  };

  const calculate = () => {
    try {
      if (!input || isOperator(getLastChar())) return;

      const result = Function(`"use strict"; return (${input})`)();

      if (typeof result === "number" && isFinite(result)) {
        setInput(result.toString());
      }
    } catch {
      setInput("Error");
    }
  };

  const clearLastChar = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const clearAll = () => {
    setInput("");
  };

  return (
    <div className="flex justify-center items-center w-full h-screen flex-col">
      <div className="flex flex-col items-center justify-center w-full mb-4">
        <input
          className="w-[480px] h-16 border-2 text-3xl px-4"
          value={input}
          placeholder="0"
          readOnly
        />
      </div>

      <div className="flex w-full justify-center">
        <div className="bg-gray-300 w-[480px] p-2 text-black">
          <div className="grid grid-cols-4 gap-2">
            {["+", "-", "/", "*"].map(op => (
              <button key={op} data-value={op} onClick={clickVal}>
                {op}
              </button>
            ))}

            {["7", "8", "9"].map(n => (
              <button key={n} data-value={n} onClick={clickVal}>{n}</button>
            ))}

            <button className="row-span-3 bg-green-400" onClick={calculate}>
              =
            </button>

            {["4", "5", "6", "1", "2", "3", "0", "."].map(n => (
              <button key={n} data-value={n} onClick={clickVal}>{n}</button>
            ))}

            <button onClick={clearAll}>AC</button>
            <button onClick={clearLastChar}>C</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
