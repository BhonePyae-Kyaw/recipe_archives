import { dbConnect } from "../../../utils/db";
import User from "../../../models/user";
import { NextResponse } from "next/server";
/**Find by Id */
export const GET = async (request) => {
  try {
    const { id } = request.query;
    await dbConnect();
    const user = await User.findById(id);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error in fetching user " + error.message }),
      { status: 500 }
    );
  }
};
