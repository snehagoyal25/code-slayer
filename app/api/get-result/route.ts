import { NextRequest } from "next/server";
import db from "@/db";
import "dotenv/config";
import assert from "assert";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/authConfig";
import { Result } from "@/components/Smackdown";

export async function GET(req: NextRequest) {
	const session = await getServerSession(authOptions)
	if (!session) {
		return new Response("Unauthorized", { status: 401 });
	}
	try {
		const token = new URL(req.url).searchParams.get("token");
		assert(token, "token is missing");
		const arena = await db.arena.findFirst({
			where: {
				token: token
			},
			select: {
				problems: true,
				points: true,
				users: {
					where: {
						id: session.user.id
					},
					select: {
						submissions: {
							where: {
								arena: {
									token: token
								}
							},
							select: {
								problem: true
							}
						},
					}
				},
			}
		})
		if (!arena) {
			return new Response("Arena not found", { status: 404 });
		}
		const UniqueSubmissions: { id: number, difficulty: "Easy" | "Medium" | "Hard" }[] = Array.from(new Set(arena.users[0].submissions.map(submission => JSON.stringify(submission.problem)))).map(e => JSON.parse(e));

		const difficultyValues = {
			Easy: 5,
			Medium: 10,
			Hard: 20,
		};
		const accumulatedPoints = UniqueSubmissions.reduce((sum, submission) => {
			return sum + difficultyValues[submission.difficulty];
		}, 0)
		const res: Result = {
			score: accumulatedPoints,
			bestScore: arena.points,
			solved: UniqueSubmissions.length,
			solvedOutOf: arena.problems.length,
			token: token,
		}
		return Response.json(res);
	} catch (e) {
		console.error(e);
		return new Response("Something went wrong", { status: 500 });
	}
}
