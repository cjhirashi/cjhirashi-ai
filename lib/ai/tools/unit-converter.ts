import { tool } from "ai";
import { z } from "zod";

type ConversionType = "length" | "weight" | "temperature" | "volume" | "time";

type ConversionFactor = {
  toBase: number;
  symbol: string;
};

interface ConversionTable {
  [unit: string]: ConversionFactor;
}

interface AllConversions {
  [key in ConversionType]: ConversionTable;
}

const conversions: AllConversions = {
  length: {
    // Base unit: meters
    mm: { toBase: 0.001, symbol: "mm" },
    cm: { toBase: 0.01, symbol: "cm" },
    m: { toBase: 1, symbol: "m" },
    km: { toBase: 1000, symbol: "km" },
    inch: { toBase: 0.0254, symbol: "in" },
    foot: { toBase: 0.3048, symbol: "ft" },
    yard: { toBase: 0.9144, symbol: "yd" },
    mile: { toBase: 1609.34, symbol: "mi" },
  },
  weight: {
    // Base unit: kilograms
    mg: { toBase: 0.000001, symbol: "mg" },
    g: { toBase: 0.001, symbol: "g" },
    kg: { toBase: 1, symbol: "kg" },
    oz: { toBase: 0.0283495, symbol: "oz" },
    lb: { toBase: 0.453592, symbol: "lb" },
    ton: { toBase: 1000, symbol: "ton" },
  },
  volume: {
    // Base unit: liters
    ml: { toBase: 0.001, symbol: "ml" },
    l: { toBase: 1, symbol: "l" },
    "gallon-us": { toBase: 3.78541, symbol: "gal (US)" },
    "gallon-uk": { toBase: 4.54609, symbol: "gal (UK)" },
    "cup-us": { toBase: 0.236588, symbol: "cup (US)" },
    "fl-oz-us": { toBase: 0.0295735, symbol: "fl oz (US)" },
  },
  temperature: {
    // Special case: not a linear conversion
    c: { toBase: 1, symbol: "°C" },
    f: { toBase: 1, symbol: "°F" },
    k: { toBase: 1, symbol: "K" },
  },
  time: {
    // Base unit: seconds
    ms: { toBase: 0.001, symbol: "ms" },
    s: { toBase: 1, symbol: "s" },
    min: { toBase: 60, symbol: "min" },
    h: { toBase: 3600, symbol: "h" },
    d: { toBase: 86400, symbol: "d" },
    w: { toBase: 604800, symbol: "w" },
    month: { toBase: 2592000, symbol: "month" },
    y: { toBase: 31536000, symbol: "y" },
  },
};

function normalizeUnit(unit: string): string {
  return unit.toLowerCase().trim();
}

function getConversionType(unit: string): ConversionType | null {
  const normalized = normalizeUnit(unit);
  for (const [type, table] of Object.entries(conversions)) {
    if (normalized in table) {
      return type as ConversionType;
    }
  }
  return null;
}

function convertTemperature(
  value: number,
  fromUnit: string,
  toUnit: string
): number {
  const from = normalizeUnit(fromUnit);
  const to = normalizeUnit(toUnit);

  // Convert to Celsius first
  let celsius: number;
  if (from === "c") {
    celsius = value;
  } else if (from === "f") {
    celsius = ((value - 32) * 5) / 9;
  } else if (from === "k") {
    celsius = value - 273.15;
  } else {
    throw new Error(`Invalid temperature unit: ${fromUnit}`);
  }

  // Convert from Celsius to target unit
  if (to === "c") {
    return celsius;
  }
  if (to === "f") {
    return (celsius * 9) / 5 + 32;
  }
  if (to === "k") {
    return celsius + 273.15;
  }

  throw new Error(`Invalid temperature unit: ${toUnit}`);
}

function convertUnits(value: number, fromUnit: string, toUnit: string): number {
  const from = normalizeUnit(fromUnit);
  const to = normalizeUnit(toUnit);

  if (from === to) {
    return value;
  }

  // Check if both units exist and are of same type
  const fromType = getConversionType(from);
  const toType = getConversionType(to);

  if (!fromType || !toType) {
    throw new Error(`Unknown unit: ${fromType ? toUnit : fromUnit}`);
  }

  if (fromType !== toType) {
    throw new Error(
      `Cannot convert between different unit types: ${fromType} and ${toType}`
    );
  }

  // Special handling for temperature (non-linear)
  if (fromType === "temperature") {
    return convertTemperature(value, from, to);
  }

  // Linear conversion
  const table = conversions[fromType];
  const fromFactor = table[from];
  const toFactor = table[to];

  if (!fromFactor || !toFactor) {
    throw new Error(`Unknown unit: ${!fromFactor ? from : to}`);
  }

  const inBaseUnit = value * fromFactor.toBase;
  return inBaseUnit / toFactor.toBase;
}

export const unitConverter = tool({
  description:
    "Convert between different units of measurement. Supports length (m, km, ft, mile, etc.), weight (kg, lb, oz, etc.), volume (l, gallon, cup, etc.), temperature (C, F, K), and time (s, min, h, d, etc.).",
  inputSchema: z.object({
    value: z.number().describe("The numerical value to convert"),
    fromUnit: z
      .string()
      .describe(
        "The unit to convert from (e.g., 'km', 'lb', 'celsius', 'hour')"
      ),
    toUnit: z
      .string()
      .describe("The unit to convert to (e.g., 'mile', 'kg', 'fahrenheit')"),
  }),
  execute: async ({ value, fromUnit, toUnit }) => {
    try {
      const result = convertUnits(value, fromUnit, toUnit);

      const from = normalizeUnit(fromUnit);
      const to = normalizeUnit(toUnit);
      const fromType = getConversionType(from);
      const toType = getConversionType(to);
      const fromSymbol = conversions[fromType!]?.[from]?.symbol || from;
      const toSymbol = conversions[toType!]?.[to]?.symbol || to;

      return {
        value,
        fromUnit: fromSymbol,
        toUnit: toSymbol,
        result,
        expression: `${value} ${fromSymbol} = ${result.toFixed(6)} ${toSymbol}`,
        success: true,
      };
    } catch (error) {
      return {
        value,
        fromUnit,
        toUnit,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  },
});
