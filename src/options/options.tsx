import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

const test = <p>Hello world!</p>;

const entry = document.createElement("div");
entry.id = "entry";
document.body.appendChild(entry);
const root = createRoot(document.getElementById("entry"));
root.render(test);
