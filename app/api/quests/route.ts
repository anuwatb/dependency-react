import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quest from "@/database/quest.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        let quest;
        
        try {
            quest = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json({ status: 400 });
        }

        const deps = JSON.parse(formData.get('deps') as string);
        
        await Quest.create({
            ...quest,
            deps: deps,
        });

        return NextResponse.json({ message: 'Quest created successfully' }, { status: 201 });
    } catch (e) {
        return NextResponse.json({ message: 'Quest Creation Failed', error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();

        const quests = await Quest.find();

        return NextResponse.json({ quests }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: e }, { status: 500 });
    }
}