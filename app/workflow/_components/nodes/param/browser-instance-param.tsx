"use client";

import React from "react";
import { ParamProps } from "@/types/app-node";

function BrowserInstanceParam({ param }: ParamProps) {
  return <p className="text-xs">{param.name}</p>;
}

export default BrowserInstanceParam;
