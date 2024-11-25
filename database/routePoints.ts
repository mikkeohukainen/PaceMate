import { getDatabase } from "./database";
import { RoutePoint } from "@/lib/route";

export const routePointQueries = {
  // insert single route point into the database
  create: async (point: RoutePoint): Promise<void> => {
    const db = await getDatabase();
    const query = `
      INSERT INTO route_points (
        exercise_id,
        timestamp,
        latitude,
        longitude
      ) VALUES (?, ?, ?, ?)
    `;

    await db.runAsync(query, [
      point.exercise_id,
      point.timestamp,
      point.latitude,
      point.longitude,
    ]);
  },
  // insert array of route points into the database
  async bulkCreate(routePoints: RoutePoint[]): Promise<void> {
    const db = await getDatabase();
    const query = `
      INSERT INTO route_points (
        exercise_id,
        timestamp,
        latitude,
        longitude
      ) VALUES (?, ?, ?, ?)
    `;

    for (const point of routePoints) {
      await db.runAsync(query, [
        point.exercise_id,
        point.timestamp,
        point.latitude,
        point.longitude,
      ]);
    }
  },
  // get all route points by exercise id
  async findByExerciseId(exerciseId: number): Promise<RoutePoint[]> {
    const db = await getDatabase();
    const query = `
      SELECT *
      FROM route_points
      WHERE exercise_id = ?
      ORDER BY timestamp
    `;

    return await db.getAllAsync<RoutePoint>(query, [exerciseId]);
  },
  deleteByExerciseId: async (exerciseId: number): Promise<void> => {
    const db = await getDatabase();
    const query = `
      DELETE FROM route_points
      WHERE exercise_id = ?
    `;
    await db.runAsync(query, [exerciseId]);
  },
};
