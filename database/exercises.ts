import { CompletedExercise, Exercise } from "@/lib/exercise";
import { getDatabase } from "./database";

export const exerciseQueries = {
  // create an empty exercise and return the id
  async createEmpty(): Promise<number> {
    const db = await getDatabase();
    const { lastInsertRowId } = await db.runAsync(
      "INSERT INTO exercises DEFAULT VALUES"
    );
    return lastInsertRowId;
  },

  // update an exercise
  async update(exercise: CompletedExercise): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `
      UPDATE exercises
      SET
        type = ?,
        start_time = ?,
        end_time = ?,
        duration = ?,
        distance = ?,
        avg_speed = ?,
        steps = ?
      WHERE id = ?
    `,
      [
        exercise.type,
        exercise.start_time,
        exercise.end_time,
        exercise.duration,
        exercise.distance,
        exercise.avg_speed,
        exercise.steps,
        exercise.id,
      ]
    );
  },

  // create an exercise
  async create(exercise: Omit<Exercise, "id">): Promise<number> {
    const db = await getDatabase();
    const { lastInsertRowId } = await db.runAsync(
      `
      INSERT INTO exercises (
        type,
        start_time,
        end_time,
        duration,
        distance,
        avg_speed,
        steps
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        exercise.type,
        exercise.start_time,
        exercise.end_time,
        exercise.duration,
        exercise.distance,
        exercise.avg_speed,
        exercise.steps,
      ]
    );
    return lastInsertRowId;
  },

  // find all exercises
  async findAll(): Promise<Exercise[]> {
    const db = await getDatabase();
    return await db.getAllAsync<Exercise>(
      "SELECT * FROM exercises ORDER BY start_time DESC"
    );
  },

  async delete(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM exercises WHERE id = ?", [id]);
  },

  async findById(id: number): Promise<Exercise | null> {
    const db = await getDatabase();
    return await db.getFirstAsync<Exercise>(
      "SELECT * FROM exercises WHERE id = ?",
      [id]
    );
  },
};
