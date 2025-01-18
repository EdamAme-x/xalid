import { bench, run } from "mitata";
import { z } from "zod";
import * as v from "valibot";
import { x } from "../src";

const validObject = {
  name: "John Doe",
  age: 30,
  email: "admin@example.com",
  data: {
    createdAt: 1,
    updatedAt: 2,
    expiredAt: 3,
  },
};

const invalidObject = {
  name: null,
  age: "30",
  email: "example.com",
  data: {
    createdAt: "1",
    updatedAt: "2",
    expiredAt: "3",
  },
};

const zodSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
  data: z.object({
    createdAt: z.number(),
    updatedAt: z.number(),
    expiredAt: z.number(),
  }),
});

const valibotSchema = v.object({
  name: v.string(),
  age: v.number(),
  // @ts-expect-error: Unknown Error
  email: v.regex(v.EMAIL_REGEX),
  data: v.object({
    createdAt: v.number(),
    updatedAt: v.number(),
    expiredAt: v.number(),
  }),
});

const xalidSchema = x.object({
  name: x.string(),
  age: x.number(),
  email: x.string({
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  }),
  data: x.object({
    createdAt: x.number(),
    updatedAt: x.number(),
    expiredAt: x.number(),
  }),
});

bench("zod", () => zodSchema.safeParse(validObject));
bench("valibot", () => v.safeParse(valibotSchema, validObject));
bench("xalid", () => xalidSchema(validObject));

bench("invalid zod", () => zodSchema.safeParse(invalidObject));
bench("invalid valibot", () => v.safeParse(valibotSchema, invalidObject));
bench("invalid xalid", () => xalidSchema(invalidObject));

await run();
