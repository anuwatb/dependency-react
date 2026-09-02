import { model, models, Document, Schema } from "mongoose";

export interface IQuest extends Document {
    name: string;
    category: string;
    deps: string[];
    fullname: string;
    details: string;
}

const QuestSchema = new Schema<IQuest>(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        deps: {
            type: [String],
            required: true,
        },
        fullname: {
            type: String,
            default: "",
        },
        details: {
            type: String,
            default: "",
        }
    }
)

const Quest = models.Quest || model<IQuest>('Quest', QuestSchema);

export default Quest;