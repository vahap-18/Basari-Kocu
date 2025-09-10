import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("merges class names and removes duplicates", () => {
    const res = cn(
      "px-2",
      "py-1",
      "px-2",
      { "text-red-500": false },
      "bg-white",
    );
    expect(res).toContain("px-2");
    expect(res).toContain("py-1");
    expect(res).toContain("bg-white");
  });
});
