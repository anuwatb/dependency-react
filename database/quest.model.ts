import { model, models, Document, Schema } from "mongoose";

export interface IQuest extends Document {
    name: string;
    category: string;
    deps: string[];
}

const QuestSchema = new Schema<IQuest>(
    {
        name: {
            type: String,
        },
        category: {
            type: String,
        },
        deps: {
            type: [String],
        }
    }
)

const Quest = models.Quest || model<IQuest>('Quest', QuestSchema);

export default Quest;