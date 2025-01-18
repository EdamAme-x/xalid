export type JSONPrimitive = string | boolean | number | null;
export type JSONArray = JSONValue[];
export type JSONObject = {
  [key: string]: JSONValue;
};

export type JSONValue = JSONObject | JSONArray | JSONPrimitive;
