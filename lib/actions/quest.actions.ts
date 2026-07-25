'use server';

import connectDB from "../mongodb";
import Quest from "@/database/quest.model";

export const modifyCollection = async (documents: object[]) => {
    await connectDB();

    await Quest.deleteMany({});
    try {
        await Quest.create(documents);
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Failed to upload' };
    }
};