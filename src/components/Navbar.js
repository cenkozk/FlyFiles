import React, { useState } from "react";

export default function Navbar() {
  const [state, setState] = useState(false);

  // Replace javascript:void(0) path with your path
  const navigation = [
    { title: "Customers", path: "javascript:void(0)" },
    { title: "Careers", path: "javascript:void(0)" },
    { title: "Guides", path: "javascript:void(0)" },
    { title: "Partners", path: "javascript:void(0)" },
    { title: "Team", path: "javascript:void(0)" },
  ];

  return (
    <>
      <header className="w-[100vw] flex items-center absolute top-0 gap-x-16 justify-center">
        <nav className="w-[100vw] flex justify-evenly items-center py-4">
          <div className="flex justify-between">
            <div className="w-auto h-auto">
              <h1 className="text-white font-sans font-black  duration-150 text-2xl">
                FlyFiles
              </h1>
            </div>
          </div>
          <button className="text-zinc-500 font-sans text-sm font-semibold hover:text-zinc-300 duration-150">
            About
          </button>
        </nav>
      </header>
    </>
  );
}
