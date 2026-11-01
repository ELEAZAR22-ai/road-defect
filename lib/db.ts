import { neon, NeonQueryFunction } from "@neondatabase/serverless";

// Typed interfaces matching your schema exactly
export interface RoadSubmission {
  id: string;
  collector_id: string;
  area_name: string;
  suspected_defect: 'pothole' | 'road-crack' | 'damaged-road-edge' | 'unsure';
  latitude: number | null;
  longitude: number | null;
  gps_accuracy: number | null;
  gps_timestamp: string | null;
  digital_address?: string | null;
  landmark?: string | null;
  image_path: string;
  image_name: string;
  image_type: string;
  image_size: number;
  status: 'pending' | 'approved' | 'rejected';
  workflow_status: 'pending' | 'verified' | 'rejected' | 'in_progress' | 'repaired';
  review_note?: string | null;
  created_at: string;
  reviewed_at?: string | null;
  source: 'manual' | 'drone';
  video_timestamp?: number | null;
  ai_confidence?: number | null;
  privacy_processed: boolean;
  privacy_blur_count: number;
  device_manufacturer?: string | null;
  device_model?: string | null;
  collector_token_hash?: string | null;
  image_sha256?: string | null;
  archived_at?: string | null;
  archive_reason?: string | null;
}

export interface RoadProgressImage {
  id: string;
  submission_id: string;
  stage: 'in-progress' | 'after';
  note?: string | null;
  captured_at?: string | null;
  image_path: string;
  image_name: string;
  image_type: string;
  image_size: number;
  privacy_processed: boolean;
  privacy_blur_count: number;
  created_at: string;
}

let cachedSql: NeonQueryFunction<false, false> | null = null;

/**
 * Returns a pooled, serverless-optimized SQL instance.
 * Reuses the client instance across serverless invocations.
 */
export function getSql(): NeonQueryFunction<false, false> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured in environment variables.");
  }

  if (!cachedSql) {
    cachedSql = neon(databaseUrl);
  }

  return cachedSql;
}

/**
 * Lightweight health check for database availability (/api/health)
 */
export async function testConnection(): Promise<boolean> {
  try {
    const sql = getSql();
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection check failed:", error);
    return false;
  }
}

/**
 * Backward compatibility stub:
 * Keeps existing imports of ensureSchema() functional across the app
 * without running heavy DDL queries on every incoming request.
 */
export async function ensureSchema(): Promise<void> {
  // Schema is maintained via db/migrations. No overhead per request.
  return Promise.resolve();
}