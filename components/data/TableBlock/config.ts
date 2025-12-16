import type { Block } from "payload";

export const TableBlock: Block = {
  slug: "tableBlock",
  interfaceName: "TableBlock",
  fields: [
    {
      name: "source",
      type: "text",
      required: true,
    },
],
}