'use server';

import connectDB from "../mongodb";
import Quest from "@/database/quest.model";

export const modifyCollection = async (documents: object[]) => {
    await connectDB();

    await Quest.deleteMany({});
    await Quest.create(documents);
};