import { model, models, Document, Schema } from "mongoose";

export interface INode extends Document {
    name: string;
    category: string;
    deps: string[];
    fullname: string;
    details: string;
}

export const NodeSchema = new Schema<INode>(
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

const Node = models.Node || model<INode>('Node', NodeSchema);

export default Node;