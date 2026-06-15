import type { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Express middleware factory for Zod validation.
 * Validates req[source] against the provided schema and replaces
 * the value with the parsed (and potentially transformed) result.
 *
 * @param schema - Zod schema to validate against
 * @param source - Which part of the request to validate ("body", "query", or "params")
 */
export function validate(schema: ZodSchema, source: "body" | "query" | "params" = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse((req as any)[source]);
      if (source === "query") {
        for (const key of Object.keys(req.query)) delete req.query[key as keyof typeof req.query];
        Object.assign(req.query, parsed);
      } else {
        (req as any)[source] = parsed;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Validation failed",
          details: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
}
