import { bench, group, run } from "mitata";
import { z } from "zod";
import * as v from "valibot";
import { x } from "../src";

const valid = {
  string: "Xalid is cool",
  number: 114514,
  boolean: true,
  null: null,
  undefined: undefined,
  array: [1, 2],
  object: { a: 1, b: 2 },
  regexp: "Xalid",
} as const;

const zodSchema = {
  string: z.string(),
  number: z.number(),
  boolean: z.boolean(),
  null: z.null(),
  undefined: z.undefined(),
  array: z.array(z.number()),
  object: z.object({
    a: z.number(),
    b: z.number(),
  }),
  regexp: z.string().regex(/^Xalid$/),
} as const;

const valibotSchema = {
  string: v.string(),
  number: v.number(),
  boolean: v.boolean(),
  null: v.null(),
  undefined: v.undefined(),
  array: v.array(v.number()),
  object: v.object({
    a: v.number(),
    b: v.number(),
  }),
  regexp: v.regex(/^Xalid$/),
} as const;

const xalidSchema = {
  string: x.string(),
  number: x.number(),
  boolean: x.boolean(),
  null: x.nullish({
    strict: true,
  }),
  undefined: x.nullish(),
  array: x.array(x.number()),
  object: x.object({
    a: x.number(),
    b: x.number(),
  }),
  regexp: x.string({ regex: /^Xalid$/ }),
} as const;

for (const key in valid) {
  group(`primitive ${key}`, () => {
    // @ts-expect-error
    bench("zod", () => zodSchema[key].safeParse(valid[key]));
    // @ts-expect-error
    bench("valibot", () => v.safeParse(valibotSchema[key], valid[key]));
    // @ts-expect-error
    bench("xalid", () => xalidSchema[key](valid[key]));
  });
}

group("primitive all", () => {
  bench("zod", () => {
    for (const key in zodSchema) {
      // @ts-expect-error
      zodSchema[key].safeParse(valid[key]);
    }
  });

  bench("valibot", () => {
    for (const key in valibotSchema) {
      // @ts-expect-error
      v.safeParse(valibotSchema[key], valid[key]);
    }
  });

  bench("xalid", () => {
    for (const key in xalidSchema) {
      // @ts-expect-error
      xalidSchema[key](valid[key]);
    }
  });
});

await run();
