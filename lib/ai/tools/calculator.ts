import { tool } from "ai";
import { z } from "zod";

/**
 * Safe mathematical expression evaluator
 * Only allows basic math operations: +, -, *, /, %, ^
 * Prevents code injection by validating expression format
 */
function evaluateExpression(expression: string): number {
  // Remove whitespace
  const cleaned = expression.replace(/\s+/g, "");

  // Validate: only allow numbers, operators, parentheses, and decimal points
  if (!/^[0-9+\-*/%().^]+$/.test(cleaned)) {
    throw new Error(
      "Invalid characters in expression. Only numbers and operators (+, -, *, /, %, ^) are allowed."
    );
  }

  // Prevent code injection by ensuring no function calls or variable access
  if (/[a-zA-Z_]/.test(cleaned)) {
    throw new Error("Function calls and variables are not allowed.");
  }

  // Replace ^ with ** for exponentiation (JS compatible)
  const jsExpression = cleaned.replace(/\^/g, "**");

  try {
    // Use Function constructor with strict validation
    // This is safer than eval() since we've validated the input
    const result = Function('"use strict"; return (' + jsExpression + ")")();

    if (typeof result !== "number" || !isFinite(result)) {
      throw new Error("Result is not a valid number");
    }

    return result;
  } catch (error) {
    throw new Error(
      `Failed to evaluate expression: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export const calculator = tool({
  description:
    "Perform mathematical calculations. Supports basic arithmetic operations: addition (+), subtraction (-), multiplication (*), division (/), modulo (%), and exponentiation (^). Use parentheses for complex expressions.",
  inputSchema: z.object({
    expression: z
      .string()
      .describe(
        "Mathematical expression to evaluate (e.g., '2 + 2', '(10 * 5) / 2', '2^3')"
      ),
  }),
  execute: async ({ expression }) => {
    try {
      const result = evaluateExpression(expression);
      return {
        expression,
        result,
        success: true,
      };
    } catch (error) {
      return {
        expression,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  },
});
