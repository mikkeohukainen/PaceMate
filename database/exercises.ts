import { getDatabase, Exercise, CompletedExercise } from "./database";

export const exerciseQueries = {
  // create an empty exercise and return the id
  async createEmpty(): Promise<number> {
    const db = await getDatabase();
    const query = "INSERT INTO exercises DEFAULT VALUES";
    const { lastInsertRowId } = await db.runAsync(query);
    return lastInsertRowId;
  },

  // update an exercise
  async update(exercise: CompletedExercise): Promise<void> {
    const db = await getDatabase();
    const query = `
      UPDATE exercises
      SET
        type = ?,
        start_time = ?,
        end_time = ?,
        duration = ?,
        distance = ?,
        avg_speed = ?
      WHERE id = ?
    `;
    const params: [
      string,
      string,
      string,
      number | null,
      number | null,
      number | null,
      number,
    ] = [
      exercise.type,
      exercise.start_time,
      exercise.end_time,
      exercise.duration,
      exercise.distance,
      exercise.avg_speed,
      exercise.id,
    ];
    await db.runAsync(query, params);
  },

  // create an exercise
  async create(exercise: Omit<Exercise, "id">): Promise<number> {
    const db = await getDatabase();
    const query = `
      INSERT INTO exercises (
        type,
        start_time,
        end_time,
        duration,
        distance,
        avg_speed
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params: [
      string | null,
      string | null,
      string | null,
      number | null,
      number | null,
      number | null,
    ] = [
      exercise.type,
      exercise.start_time,
      exercise.end_time,
      exercise.duration,
      exercise.distance,
      exercise.avg_speed,
    ];
    const { lastInsertRowId } = await db.runAsync(query, params);
    return lastInsertRowId;
  },

  // find all exercises
  async findAll(): Promise<Exercise[]> {
    const db = await getDatabase();
    const query = `
      SELECT *
      FROM exercises
      ORDER BY start_time DESC
    `;
    return await db.getAllAsync<Exercise>(query);
  },

  async delete(id: number): Promise<void> {
    const db = await getDatabase();
    const query = `
      DELETE FROM exercises
      WHERE id = ?
    `;
    await db.runAsync(query, [id]);
  },
};
